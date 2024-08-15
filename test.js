const express = require('express');
const { PTouchPrint } = require('node-ptouch');
const app = express();
const PORT = 5000;

app.use(express.json());

app.post('/api/print-test', async (req, res) => {
  try {
    const ptouch = new PTouchPrint();

    // Connect to the printer (replace 'your-printer-ip' with the actual IP)
    await ptouch.connect('your-printer-ip', 9100); // Port 9100 is usually the default for Brother printers

    // Print a basic label
    await ptouch.printText('Test Page\nThis is a test print from Node.js!');

    // Close the connection after printing
    ptouch.close();

    res.status(200).send('Test page printed successfully');
  } catch (error) {
    console.error('Error printing test page:', error);
    res.status(500).send('Failed to print test page');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




import React from 'react';

const TestPrintButton = () => {
  const printTestPage = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/print-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to print test page');
      }

      alert('Test page printed successfully');
    } catch (error) {
      console.error('Error printing test page:', error);
      alert('Failed to print test page');
    }
  };

  return (
    <button onClick={printTestPage} className="px-4 py-2 bg-green-600 text-white rounded">
      Print Test Page
    </button>
  );
};

export default TestPrintButton;
