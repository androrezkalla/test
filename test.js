import React, { useState } from 'react';
import axios from 'axios';

const CentralDatabase = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        uploadFile(file); 
    };

    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Upload Excel File</button>
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />
        </div>
    );
};






const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: '' });

        for (let row of jsonData) {
            const { AssetNumber, LoginID, BusinessGroup, EmployeeID } = row;

            if (AssetNumber && LoginID && BusinessGroup && EmployeeID) {
                await pool.query(
                    'INSERT INTO your_table_name (asset_number, login_id, business_group, employee_id) VALUES ($1, $2, $3, $4)',
                    [AssetNumber, LoginID, BusinessGroup, EmployeeID]
                );
            }
        }

        res.send('File uploaded and data inserted successfully');
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Server error');
    }
});

// Add your other routes and server logic here

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
});




