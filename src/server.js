/**
 * Server Entry Point
 */
require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/database');
const serverConfig = require('./config/server');
const logger = require('./utils/logger');

// Log startup information
logger.info(`Starting server in ${serverConfig.environment} mode`);
logger.info(`Using LLM API at ${serverConfig.llmApiUrl}`);

// Start server
const startServer = async () => {

  try {

    await connectDB();
    
    const server = app.listen(serverConfig.port, () => {
      logger.info(`Server running on port ${serverConfig.port}`);
      
      // List all registered routes (in development mode)
      if (serverConfig.environment === 'development') {
        const routes = [];
        app._router.stack.forEach((middleware) => {
          if (middleware.route) { // Routes registered directly
            routes.push(`${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`);
          } else if (middleware.name === 'router') { // Router middleware
            middleware.handle.stack.forEach((handler) => {
              const route = handler.route;
              if (route) {
                routes.push(`${Object.keys(route.methods)[0].toUpperCase()} ${middleware.path}${route.path}`);
              }
            });
          }
        });
        logger.info('Registered routes:');
        routes.forEach(route => logger.info(`- ${route}`));
      }
    });
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
      });
    });
    
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

