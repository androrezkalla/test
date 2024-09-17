import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GalaCheckIn = () => {
  const [guestList, setGuestList] = useState([]);
  const [adminView, setAdminView] = useState(true); // State to toggle between admin and user view
  const [scannedGuest, setScannedGuest] = useState(null);
  const [message, setMessage] = useState('');
  const [flashColor, setFlashColor] = useState('bg-gray-900'); // Default to grey background

  // Fetch the guest list from the backend
  const fetchGuestList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/get-guest-list');
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
      await axios.post('http://localhost:5000/api/upload-guest-list', formData);
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
        setFlashColor('bg-green-900');
      } else {
        setScannedGuest(null);
        setMessage(`${firstName} is not on the guest list!`);
        setFlashColor('bg-red-900');
      }

      // Clear the flash and reset to grey after a delay
      setTimeout(() => {
        setFlashColor('bg-gray-900');
        setMessage('');
      }, 2000); // Adjust the delay as needed
    }
    e.target.value = ''; // Clear the input after processing
  };

  return (
    <div className={`min-h-screen w-full ${flashColor} flex flex-col items-center justify-center p-4 transition-colors duration-300`}>
      {adminView ? (
        // Admin View
        <div className="w-full max-w-5xl">
          <h2 className="text-3xl font-semibold mb-6 text-center text-white">Admin Section</h2>
          <div className="mb-8 flex flex-col items-center">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleUpload}
              className="mb-4 p-2 rounded cursor-pointer bg-gray-700 text-white"
            />
            <div className="overflow-x-auto w-full">
              <table className="min-w-full bg-gray-800 rounded-lg">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="py-3 px-4 text-left font-medium text-white">First Name</th>
                    <th className="py-3 px-4 text-left font-medium text-white">Last Name</th>
                    <th className="py-3 px-4 text-left font-medium text-white">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {guestList.map((guest, index) => (
                    <tr key={index} className="border-b border-gray-600 hover:bg-gray-600">
                      <td className="py-3 px-4">{guest.first_name}</td>
                      <td className="py-3 px-4">{guest.last_name}</td>
                      <td className="py-3 px-4">{guest.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Button to toggle between Admin and User views */}
          <button
            onClick={() => setAdminView(!adminView)}
            className="fixed bottom-4 right-4 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Switch to User View
          </button>
        </div>
      ) : (
        // User View
        <div className="flex flex-col items-center justify-center w-full h-full relative">
          {/* Logo and "Welcome to the Gala" at the top */}
          <div className="absolute top-0 left-0 right-0 flex flex-col items-center mt-4">
            <div className="mb-4">
              {/* Placeholder for Logo */}
              <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white">Logo</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white">Welcome to the Gala</h1>
          </div>

          {/* Centered Welcome Message */}
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-6xl font-bold text-white">{message}</h1>
          </div>

          {/* Barely visible input strip at the bottom */}
          <input
            type="text"
            placeholder="Scan QR Code Here"
            onChange={handleScanInput}
            className="fixed bottom-1 w-full bg-transparent text-transparent outline-none focus:outline-none"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default GalaCheckIn;
