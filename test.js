import React, { useState } from 'react';

const CheckInSystem = () => {
  const [status, setStatus] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleScan = async (event) => {
    // The scanner will enter the scanned data into the input field
    const result = event.target.value;
    event.target.value = ''; // Clear input field after reading

    // Assuming the result format is `firstname,lastname,email`
    const [firstName, lastName, email] = result.split(',');

    try {
      const response = await fetch(`/check?email=${email}`);
      const data = await response.json();
      if (data.onList) {
        setIsValid(true);
        setStatus(`Welcome ${firstName}`);
      } else {
        setIsValid(false);
        setStatus(`${firstName} is not on the list`);
      }
    } catch (err) {
      setIsValid(false);
      setStatus('Error checking user');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <img src="/path-to-your-logo.png" alt="Logo" className="mb-6 w-32 h-32" />

      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg text-center transition duration-500 ease-in-out ${
          isValid ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        <h1 className="text-white text-2xl font-bold">{status || 'Please scan a QR code'}</h1>
      </div>

      {/* Hidden input field to capture scanner input */}
      <input
        type="text"
        onChange={handleScan}
        className="hidden"
        autoFocus
      />
    </div>
  );
};

export default CheckInSystem;
