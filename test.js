const express = require('express');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// PostgreSQL setup
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up file upload
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload Excel file
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    // Read the Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Validate data structure
    if (data.length === 0 || !data[0].FirstName || !data[0].LastName || !data[0].Email) {
      return res.status(400).send('Invalid file format');
    }

    // Insert data into the database
    const client = await pool.connect();
    await client.query('BEGIN');

    for (let row of data) {
      const { FirstName, LastName, Email } = row;
      await client.query(
        'INSERT INTO users (first_name, last_name, email) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING',
        [FirstName, LastName, Email]
      );
    }

    await client.query('COMMIT');
    res.send('File uploaded and data inserted');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error processing file:', err);
    res.status(500).send('Error processing file');
  } finally {
    client.release();
  }
});

// Check user
app.get('/check', async (req, res) => {
  const { email } = req.query;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ onList: true, firstName: user.first_name });
    } else {
      res.json({ onList: false, firstName: null });
    }
  } catch (err) {
    console.error('Error checking user:', err);
    res.status(500).send('Error checking user');
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Error fetching users');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
