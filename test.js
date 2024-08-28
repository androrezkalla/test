import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const GalaCheckIn = () => {
  const [guestList, setGuestList] = useState([]);
  const [scannedGuest, setScannedGuest] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const guests = XLSX.utils.sheet_to_json(sheet);
      setGuestList(guests);
    };
    reader.readAsBinaryString(file);
  };

  const handleScanInput = (e) => {
    const input = e.target.value.trim();
    if (input) {
      const [firstName, lastName, email] = input.split(',');
      const foundGuest = guestList.find(
        (guest) =>
          guest.Email.toLowerCase() === email.toLowerCase() &&
          guest.FirstName.toLowerCase() === firstName.toLowerCase() &&
          guest.LastName.toLowerCase() === lastName.toLowerCase()
      );
      if (foundGuest) {
        setScannedGuest(foundGuest);
        setMessage(`Welcome, ${foundGuest.FirstName}!`);
      } else {
        setScannedGuest(null);
        setMessage(`${firstName} is not on the guest list!`);
      }
    }
    e.target.value = ''; // Clear the input after processing
  };

  const handleManualCheck = () => {
    alert(JSON.stringify(guestList, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Performance Gala Check-In</h1>

      <div className="mb-4">
        <input type="file" accept=".xlsx" onChange={handleUpload} className="mb-2" />
        <button
          onClick={handleManualCheck}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Manually Check Guest List
        </button>
      </div>

      <div className="w-full max-w-md">
        <input
          type="text"
          onKeyDown={(e) => e.key === 'Enter' && handleScanInput(e)}
          placeholder="Scan QR code here..."
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          autoFocus
        />
      </div>

      <div className="mt-6">
        {scannedGuest ? (
          <div className="p-4 bg-green-500 text-white text-center rounded">
            {message}
          </div>
        ) : message && (
          <div className="p-4 bg-red-500 text-white text-center rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalaCheckIn;
