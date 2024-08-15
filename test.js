const express = require('express');
const BrotherSDK = require('brother-ptouch-sdk'); // Import the SDK
const app = express();
const port = 5000;

app.use(express.json());

// Replace with your printer's name
const printerName = 'Brother PT-P900W';

app.post('/api/print', async (req, res) => {
    const { firstName, lastName, qrData } = req.body;

    try {
        const printer = new BrotherSDK.Printer(printerName);

        // Generate the label content
        const labelContent = `
            First Name: ${firstName}\n
            Last Name: ${lastName}\n
            QR Code: ${qrData}
        `;

        // Print the label
        await printer.printLabel(labelContent);

        res.status(200).send('Label printed successfully');
    } catch (error) {
        console.error('Error printing label:', error);
        res.status(500).send('Failed to print label');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';

const QrCodeGenerator = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/assets');
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  const generateQrValue = (asset) => {
    const { asset_number, login_id, first_name, last_name } = asset;

    // Create an array to hold the non-null values
    const qrData = [];
    if (asset_number) qrData.push(`Asset Number: ${asset_number}`);
    if (login_id) qrData.push(`Login ID: ${login_id}`);
    if (first_name) qrData.push(`First Name: ${first_name}`);
    if (last_name) qrData.push(`Last Name: ${last_name}`);

    // Join the values into a single string
    return qrData.join(', ');
  };

  const printLabel = async (asset) => {
    const qrData = generateQrValue(asset);

    try {
      const response = await fetch('http://localhost:5000/api/print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: asset.first_name,
          lastName: asset.last_name,
          qrData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to print label');
      }

      alert('Label printed successfully');
    } catch (error) {
      console.error('Error printing label:', error);
      alert('Failed to print label');
    }
  };

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
      {assets.map((asset) => (
        <div
          key={asset.asset_number}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow mb-4"
        >
          <p><strong>Asset Number:</strong> {asset.asset_number || 'N/A'}</p>
          <p><strong>Login ID:</strong> {asset.login_id || 'N/A'}</p>
          <p><strong>First Name:</strong> {asset.first_name || 'N/A'}</p>
          <p><strong>Last Name:</strong> {asset.last_name || 'N/A'}</p>
          <QRCode
            value={generateQrValue(asset)}
            size={128}
            bgColor={darkMode ? '#333' : '#fff'}
            fgColor={darkMode ? '#fff' : '#000'}
            includeMargin={true}
          />
          <button
            className="mt-4 p-2 bg-blue-500 text-white rounded"
            onClick={() => printLabel(asset)}
          >
            Print Label
          </button>
        </div>
      ))}
    </div>
  );
};

export default QrCodeGenerator;
