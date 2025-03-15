/**
 * Migration Runner
 * A script to execute database migrations
 */
const { Sequelize } = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');
require('dotenv').config();

// Get database configuration from environment
const {
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'fitness_planner',
  DB_USER = 'postgres',
  DB_PASSWORD = 'root',
  DB_DIALECT = 'postgres'
} = process.env;

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: DB_DIALECT,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  logging: console.log
});

// Create Umzug instance for migrations
const umzug = new Umzug({
  migrations: {
    glob: path.join(__dirname, '../db/migrations/*.js'),
    resolve: ({ name, path, context }) => {
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(context.queryInterface, Sequelize),
        down: async () => migration.down(context.queryInterface, Sequelize),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

// Function to run migrations
async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    const pending = await umzug.pending();
    console.log(`Found ${pending.length} pending migrations.`);
    
    if (pending.length > 0) {
      const migrations = await umzug.up();
      console.log('Migrations executed successfully:');
      migrations.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log('No pending migrations to execute.');
    }
    
    console.log('Migration process completed.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
