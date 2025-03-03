/**
 * Singleton Database Pattern Implementation
 * 
 * This class ensures only one database connection is created and shared across the application.
 * It implements the Singleton pattern to provide a global access point to the database connection.
 * 
 * Features:
 * - Single database connection instance
 * - Connection pooling
 * - Error handling and reconnection logic
 * - Query execution methods
 * 
 * @class SingletonDatabase
 */

/**
 * Get the database instance
 * @function getInstance
 * @returns {SingletonDatabase} The singleton database instance
 */

/**
 * Execute a SQL query
 * @function query
 * @param {string} sql - SQL query to execute
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query results
 */

/**
 * Begin a database transaction
 * @function beginTransaction
 * @returns {Promise<Object>} Transaction object
 */

/**
 * Execute multiple queries in a transaction
 * @function executeTransaction
 * @param {Array} queries - Array of query objects with sql and params
 * @returns {Promise<Array>} Results of all queries
 */

/**
 * Handle connection errors and reconnect
 * @function handleConnectionError
 * @param {Error} error - Connection error
 * @private
 */