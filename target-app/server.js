const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const { Pool } = require('pg');

// Database connection settings
const dbConfig = {
  user: 'your_username',
  host: 'db.internal',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
  max: 50, // reduced max number of connections to prevent exhaustion
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 5000, // increased connection timeout to 5 seconds
};

// Create a connection pool with a retry mechanism
const pool = new Pool(dbConfig);

// Handle database connection errors
pool.on('error', (err, client) => {
  console.error('Database connection error:', err);
});

app.get('/', (req, res) => {
  res.send('Target App is Running Normally ');
});

// Intentional Bug Route
app.get('/api/broken', (req, res) => {
  const userAnswers = [1, 2, 3];

  if (userAnswers.length > 0) {
    res.json({ success: true, count: userAnswers.length });
  } else {
    res.json({ success: false });
  }
});

// Add a route to test database connection with retry
app.get('/api/db-test', async (req, res) => {
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount <= maxRetries) {
    try {
      const result = await pool.query('SELECT 1');
      res.json({ success: true, result: result.rows[0] });
      break;
    } catch (err) {
      console.error('Database query error:', err);
      retryCount++;
      if (retryCount > maxRetries) {
        res.status(503).json({ success: false, error: 'Database connection failed' });
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second before retrying
      }
    }
  }
});

app.listen(PORT, () => {
  console.log(`Target app listening on port ${PORT}`);
});

// Close the database connection pool when the process exits
process.on('exit', () => {
  pool.end();
});