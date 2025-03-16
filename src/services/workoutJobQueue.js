/**
 * Workout Job Queue Service
 * 
 * Handles asynchronous workout generation jobs to prevent blocking the main thread
 */
const EventEmitter = require('events');
const logger = require('../utils/logger');

// Create a job queue that extends EventEmitter for notifications
class WorkoutJobQueue extends EventEmitter {
  constructor() {
    super();
    this.jobs = new Map(); // Map of job ID -> job object
    this.activeJobs = new Set(); // Track currently running jobs
    this.maxConcurrentJobs = 3; // Allow more concurrent jobs
    
    // Set up periodic cleanup of old jobs
    this.cleanupInterval = setInterval(() => this.cleanupOldJobs(), 15 * 60 * 1000); // 15 minutes
    
    // Set up stalled job detection
    this.stalledJobCheckInterval = setInterval(() => this.checkForStalledJobs(), 60 * 1000); // 1 minute
    
    logger.info('Workout job queue initialized');
  }

  /**
   * Add a new job to the queue
   * @param {string} jobId - Unique job identifier
   * @param {Object} data - Job data
   * @param {Function} processFn - Async function to process the job
   * @returns {Object} Job status object
   */
  addJob(jobId, data, processFn) {
    // Check if job already exists
    if (this.jobs.has(jobId)) {
      logger.warn(`Job ${jobId} already exists, returning existing job`);
      return this.getJobStatus(jobId);
    }
    
    // Create job object
    const job = {
      id: jobId,
      data,
      status: 'pending',
      progress: 0,
      result: null,
      error: null,
      createdAt: new Date(),
      processFn,
      startedAt: null,
      completedAt: null,
      lastActivityAt: new Date() // Track last activity to detect stalled jobs
    };

    // Add to queue
    this.jobs.set(jobId, job);
    logger.info(`Job ${jobId} added to queue`);

    // Start job immediately in a non-blocking way
    setTimeout(() => {
      this.startJob(jobId).catch(err => {
        logger.error(`Failed to start job ${jobId}: ${err.message}`);
      });
    }, 0);

    return this.getJobStatus(jobId);
  }

  /**
   * Get the status of a job
   * @param {string} jobId - Job identifier
   * @returns {Object|null} Job status or null if not found
   */
  getJobStatus(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) {
      return null;
    }

    // Update last activity time when status is checked
    job.lastActivityAt = new Date();

    return {
      id: job.id,
      status: job.status,
      progress: job.progress,
      result: job.result,
      error: job.error,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt
    };
  }

  /**
   * Update job progress
   * @param {string} jobId - Job identifier
   * @param {number} progress - Progress percentage (0-100)
   * @param {string} [message] - Optional status message
   */
  updateJobProgress(jobId, progress, message = '') {
    const job = this.jobs.get(jobId);
    if (job) {
      job.progress = progress;
      job.status = 'processing';
      job.lastActivityAt = new Date(); // Update last activity time
      
      // Emit event for any listeners
      this.emit('progress', {
        id: jobId,
        progress,
        message,
        status: 'processing'
      });
      
      logger.debug(`Job ${jobId} progress: ${progress}%${message ? ' - ' + message : ''}`);
    }
  }

  /**
   * Start processing a specific job
   * @param {string} jobId - Job identifier
   * @private
   */
  async startJob(jobId) {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'pending') {
      return;
    }

    // Check if we're at max capacity
    if (this.activeJobs.size >= this.maxConcurrentJobs) {
      // Try again after a short delay
      setTimeout(() => this.startJob(jobId), 1000);
      return;
    }
    
    // Mark job as processing
    this.activeJobs.add(jobId);
    job.status = 'processing';
    job.startedAt = new Date();
    job.progress = 0;
    job.lastActivityAt = new Date();
    
    // Emit event
    this.emit('start', { id: jobId, status: 'processing' });
    
    logger.info(`Starting job ${jobId}`);

    // Set timeout to prevent hanging jobs (5 minutes max)
    const timeout = setTimeout(() => {
      if (this.jobs.has(jobId) && this.jobs.get(jobId).status === 'processing') {
        logger.error(`Job ${jobId} timed out after 5 minutes`);
        this.completeJob(jobId, null, new Error('Job timed out after 5 minutes'));
      }
    }, 5 * 60 * 1000);

    try {
      // Process the job with the provided function
      const result = await job.processFn(job.data, (progress, message) => {
        this.updateJobProgress(jobId, progress, message);
      });

      // Job completed successfully
      this.completeJob(jobId, result);
      logger.info(`Job ${jobId} completed successfully`);
    } catch (error) {
      // Job failed
      logger.error(`Job ${jobId} failed: ${error.message}`);
      this.completeJob(jobId, null, error);
    } finally {
      clearTimeout(timeout);
    }
  }
  
  /**
   * Complete a job with result or error
   * @param {string} jobId - Job ID
   * @param {*} result - Job result
   * @param {Error} [error] - Optional error
   */
  completeJob(jobId, result, error = null) {
    const job = this.jobs.get(jobId);
    if (!job) return;
    
    job.completedAt = new Date();
    job.lastActivityAt = new Date();
    
    if (error) {
      job.status = 'failed';
      job.error = error.message || 'Unknown error';
      
      // Emit event
      this.emit('error', {
        id: jobId,
        status: 'failed',
        error: job.error
      });
    } else {
      job.status = 'completed';
      job.progress = 100;
      job.result = result;
      
      // Emit event
      this.emit('complete', { 
        id: jobId, 
        status: 'completed', 
        result 
      });
    }
    
    // Remove from active jobs
    this.activeJobs.delete(jobId);
    
    // Schedule cleanup after 30 minutes
    setTimeout(() => {
      if (this.jobs.has(jobId)) {
        this.jobs.delete(jobId);
        logger.debug(`Cleaned up job ${jobId}`);
      }
    }, 30 * 60 * 1000);
  }
  
  /**
   * Cancel a job by ID
   * @param {string} jobId - Job ID to cancel
   * @returns {boolean} True if canceled, false if not found or already completed
   */
  cancelJob(jobId) {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'completed' || job.status === 'failed') {
      return false;
    }
    
    // Mark the job as failed with cancellation message
    this.completeJob(jobId, null, new Error('Job canceled by user'));
    logger.info(`Job ${jobId} was canceled`);
    
    // Emit cancel event
    this.emit('cancel', { id: jobId });
    
    return true;
  }

  /**
   * Clean up old jobs to prevent memory leaks
   * @private
   */
  cleanupOldJobs() {
    const now = new Date();
    let cleanedCount = 0;
    
    for (const [jobId, job] of this.jobs.entries()) {
      // Clean up completed or failed jobs older than 1 hour
      if ((job.status === 'completed' || job.status === 'failed') && 
          job.completedAt && 
          (now.getTime() - job.completedAt.getTime() > 60 * 60 * 1000)) {
        this.jobs.delete(jobId);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      logger.info(`Cleaned up ${cleanedCount} old jobs from queue`);
    }
  }
  
  /**
   * Check for stalled jobs and handle them
   * @private
   */
  checkForStalledJobs() {
    const now = new Date();
    let stalledCount = 0;
    
    for (const [jobId, job] of this.jobs.entries()) {
      // Check for processing jobs with no activity for more than 3 minutes
      if (job.status === 'processing' && 
          job.lastActivityAt &&
          (now.getTime() - job.lastActivityAt.getTime() > 3 * 60 * 1000)) {
        
        logger.warn(`Job ${jobId} appears stalled, marking as failed`);
        this.completeJob(jobId, null, new Error('Job stalled due to inactivity'));
        stalledCount++;
      }
    }
    
    if (stalledCount > 0) {
      logger.warn(`Found and handled ${stalledCount} stalled jobs`);
    }
  }
  
  /**
   * Get statistics about current jobs
   * @returns {Object} Queue statistics
   */
  getStats() {
    let pending = 0;
    let processing = 0;
    let completed = 0;
    let failed = 0;
    
    for (const job of this.jobs.values()) {
      switch (job.status) {
        case 'pending': pending++; break;
        case 'processing': processing++; break;
        case 'completed': completed++; break;
        case 'failed': failed++; break;
      }
    }
    
    return {
      totalJobs: this.jobs.size,
      activeJobs: this.activeJobs.size,
      pending,
      processing,
      completed,
      failed,
      maxConcurrentJobs: this.maxConcurrentJobs
    };
  }
  
  /**
   * Clean up resources when shutting down
   */
  shutdown() {
    // Clear intervals
    clearInterval(this.cleanupInterval);
    clearInterval(this.stalledJobCheckInterval);
    
    // Cancel all active jobs
    for (const jobId of this.activeJobs) {
      this.cancelJob(jobId);
    }
    
    logger.info('Workout job queue shut down');
  }
}

// Create a singleton instance
const workoutJobQueue = new WorkoutJobQueue();

module.exports = workoutJobQueue;
