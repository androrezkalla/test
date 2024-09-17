import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GalaCheckIn = () => {
  const [guestList, setGuestList] = useState([]);
  const [adminView, setAdminView] = useState(true); // State to toggle between admin and user view
  const [scannedGuest, setScannedGuest] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch the guest list from the backend
  const fetchGuestList = async () => {
    try {
      const response = await axios.get('http://localhost:3001/get-guest-list');
      setGuestList(response.data);
    } catch (error) {
      console.error('Error fetching guest list:', error);
    }
  };

  useEffect(() => {
    fetchGuestList();
  }, []);

  // Handle the file upload for the admin view
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:3001/upload-guest-list', formData);
      fetchGuestList(); // Refresh the guest list after upload
    } catch (error) {
      console.error('Error uploading guest list:', error);
    }
  };

  // Handle the scan input for the user view
  const handleScanInput = (e) => {
    const input = e.target.value.trim();
    if (input) {
      const [firstName, lastName, email] = input.split(',');
      const foundGuest = guestList.find(
        (guest) =>
          guest.email.toLowerCase() === email.toLowerCase() &&
          guest.first_name.toLowerCase() === firstName.toLowerCase() &&
          guest.last_name.toLowerCase() === lastName.toLowerCase()
      );
      if (foundGuest) {
        setScannedGuest(foundGuest);
        setMessage(`Welcome, ${foundGuest.first_name}!`);
      } else {
        setScannedGuest(null);
        setMessage(`${firstName} is not on the guest list!`);
      }
    }
    e.target.value = ''; // Clear the input after processing
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {adminView ? (
        // Admin View: Upload guest list and view the list
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Admin Section</h2>
          <div className="mb-4">
            <input type="file" accept=".xlsx" onChange={handleUpload} className="mb-2" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4">First Name</th>
                  <th className="py-2 px-4">Last Name</th>
                  <th className="py-2 px-4">Email</th>
                </tr>
              </thead>
              <tbody>
                {guestList.map((guest, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">{guest.first_name}</td>
                    <td className="py-2 px-4">{guest.last_name}</td>
                    <td className="py-2 px-4">{guest.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // User View: Scan QR codes
        <div className={`min-h-screen w-full flex flex-col items-center justify-center ${scannedGuest ? 'bg-green-500' : 'bg-red-500'}`}>
          <input
            type="text"
            placeholder="Scan QR Code Here"
            onChange={handleScanInput}
            className="mb-4 px-4 py-2 border rounded"
            autoFocus
          />
          <h1 className="text-white text-4xl font-bold">{message}</h1>
        </div>
      )}

      {/* Button to toggle between Admin and User views */}
      <button
        onClick={() => setAdminView(!adminView)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        {adminView ? 'Switch to User View' : 'Switch to Admin View'}
      </button>
    </div>
  );
};

export default GalaCheckIn;



const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const { Pool } = require('pg'); // Use 'pg' for PostgreSQL
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for cross-origin requests

// Database connection configuration
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'gala_event',
  password: 'your_db_password',
  port: 5432, // Default PostgreSQL port
});

// Set up Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to upload and process the guest list
app.post('/upload-guest-list', upload.single('file'), async (req, res) => {
  try {
    // Read the uploaded file from the request
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const guests = XLSX.utils.sheet_to_json(sheet);

    // Insert each guest into the database
    for (let guest of guests) {
      const { FirstName, LastName, Email } = guest;
      await pool.query(
        `INSERT INTO guests (first_name, last_name, email) 
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING`, // Avoid duplicate entries based on email
        [FirstName, LastName, Email]
      );
    }

    res.status(200).send('Guest list uploaded and saved successfully.');
  } catch (error) {
    console.error('Error uploading guest list:', error);
    res.status(500).send('Failed to upload guest list.');
  }
});

// Endpoint to get all guests
app.get('/get-guest-list', async (req, res) => {
  try {
    const result = await pool.query('SELECT first_name, last_name, email FROM guests');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching guest list:', error);
    res.status(500).send('Failed to fetch guest list.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
