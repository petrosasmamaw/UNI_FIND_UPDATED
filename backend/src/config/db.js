const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required. Set it in backend/.env');
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  await pool.query('SELECT 1');
  console.log('Postgres connected');
};

module.exports = { connectDB, pool };
