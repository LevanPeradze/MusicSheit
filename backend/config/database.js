const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

const connectionString = process.env.DATABASE_URL;

// Don't throw error during build - Cloud Run doesn't have DATABASE_URL at build time
// Errors will be caught at runtime when database operations are attempted
let pool = null;

if (connectionString) {
  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : undefined
  });

  // Test connection
  pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
  });

  // Test the connection (async, won't block startup)
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('❌ Database connection error:', err);
      console.error('Make sure DATABASE_URL is set correctly in your environment variables.');
    } else {
      console.log('✅ Database connection successful. Server time:', res.rows[0].now);
    }
  });
} else {
  // Create a dummy pool that will throw helpful errors when used
  console.warn('⚠️  DATABASE_URL not set. Database operations will fail. Set DATABASE_URL environment variable.');
  pool = {
    query: () => {
      throw new Error('DATABASE_URL is not set. Please add it to your environment variables.');
    }
  };
}

module.exports = pool;

