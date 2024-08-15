const express = require('express');
const { BrotherLabelPrinter } = require('node-ptouch'); // Ensure this library is installed
const app = express();
const PORT = 5000;

app.use(express.json());

app.post('/api/print-test', async (req, res) => {
  try {
    const printer = new BrotherLabelPrinter('your-printer-ip'); // Replace 'your-printer-ip' with your actual printer's IP address

    // Basic test print with some sample text
    await printer.print({
      text: "Test Page\nThis is a test print from Node.js!",
      options: {
        fontSize: 20, // Adjust as necessary
        align: 'center', // Align the text to the center of the label
      },
    });

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
