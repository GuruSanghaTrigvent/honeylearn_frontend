import { Pool } from 'pg';

// Database connection configuration
const dbConfig = {
  host: 'akanbrlhgiqbtvfznivv.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'YOUR_DB_PASSWORD', // Get this from Supabase dashboard
  ssl: {
    rejectUnauthorized: false // Required for Supabase connection
  }
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Test the connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to Supabase database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }
};

// Execute a query
export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// Close the pool
export const closePool = async () => {
  try {
    await pool.end();
    console.log('Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

export default {
  testConnection,
  executeQuery,
  closePool
}; 