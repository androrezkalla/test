import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AdminView from './AdminView';
import CheckInSystem from './CheckInSystem';
import './App.css'; // Tailwind imports

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-gray-800 p-4 text-white">
          <Link to="/" className="mr-4">Check-In System</Link>
          <Link to="/admin">Admin View</Link>
        </nav>
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<CheckInSystem />} />
            <Route path="/admin" element={<AdminView />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminView = () => {
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/upload', formData);
      alert('File uploaded successfully!');
      fetchUsers(); // Refresh the list after upload
    } catch (err) {
      alert('Error uploading file');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (err) {
      alert('Error fetching users');
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on initial load
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Upload
      </button>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 px-4 py-2 rounded"
        />
        <ul className="mt-2">
          {filteredUsers.map(user => (
            <li key={user.id} className="border border-gray-200 p-2 rounded mb-1">
              {user.first_name} {user.last_name} - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminView;


import React, { useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';

const CheckInSystem = () => {
  const [status, setStatus] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const scanner = new QrScanner(
      document.getElementById('qr-video'),
      (result) => handleScan(result),
      {
        returnDetailedScanResult: true,
      }
    );
    scanner.start();

    return () => {
      scanner.stop();
    };
  }, []);

  const handleScan = async (result) => {
    const [firstName, lastName, email] = result.data.split(',');
    try {
      const response = await fetch(`/check?email=${email}`);
      const data = await response.json();
      if (data.onList) {
        setIsValid(true);
        setStatus(`Welcome ${firstName}`);
      } else {
        setIsValid(false);
        setStatus(`${firstName} is not on list`);
      }
    } catch (err) {
      setStatus('Error checking user');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img src="/path-to-your-logo.png" alt="Logo" className="mb-6" />
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg text-center ${isValid ? 'bg-green-500' : 'bg-red-500'}`}
      >
        <h1 className="text-white text-2xl">{status}</h1>
      </div>
      <video id="qr-video" className="hidden"></video>
    </div>
  );
};

export default CheckInSystem;



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
  })
});

// Upload Excel file
app.post('/upload', upload.single('file'), async (req, res) => {
  const workbook = XLSX.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  const client = await pool.connect();
  try {
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
    console.error(err);
    res.status(500).send('Error processing file');
  } finally {
    client.release();
  }
});

// Check user
app.get('/check', async (req, res) => {
  const { email } = req.query;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length > 0) {
    const user = result.rows[0];
    res.json({ onList: true, firstName: user.first_name });
  } else {
    res.json({ onList: false, firstName: null });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});





CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50),
  email VARCHAR(100) UNIQUE NOT NULL
);
