CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    method VARCHAR(10),
    url TEXT
);



// logger.js

const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function logRequest(req, res, next) {
    const client = await pool.connect();
    const { method, url } = req;
    
    try {
        await client.query('INSERT INTO logs (method, url) VALUES ($1, $2)', [method, url]);
        next();
    } catch (error) {
        console.error('Error logging request:', error);
        res.status(500).send('Error logging request');
    } finally {
        client.release();
    }
}

module.exports = { logRequest };


// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const { logRequest } = require('./logger');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use logging middleware
app.use(logRequest);


app.get('/api/logs', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM logs ORDER BY timestamp DESC');
        client.release();
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).send('Error fetching logs');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
