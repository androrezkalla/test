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
      } else {
        setScannedGuest(null);
        setMessage(`${firstName} is not on the guest list!`);
      }
    }
    e.target.value = ''; // Clear the input after processing
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Placeholder for Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600">Logo</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8">
        {adminView ? (
          // Admin View: Upload guest list and view the list
          <div>
            <h2 className="text-3xl font-semibold mb-6 text-center">Admin Section</h2>
            <div className="mb-8 flex flex-col items-center">
              <input
                type="file"
                accept=".xlsx"
                onChange={handleUpload}
                className="mb-4 p-2 border rounded cursor-pointer"
              />
              <div className="overflow-x-auto w-full">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-3 px-4 text-left font-medium text-gray-700">First Name</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700">Last Name</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestList.map((guest, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{guest.first_name}</td>
                        <td className="py-3 px-4">{guest.last_name}</td>
                        <td className="py-3 px-4">{guest.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // User View: Scan QR codes
          <div className={`min-h-screen flex flex-col items-center justify-center ${scannedGuest ? 'bg-green-50' : 'bg-red-50'} p-8 rounded-lg`}>
            <input
              type="text"
              placeholder="Scan QR Code Here"
              onChange={handleScanInput}
              className="mb-4 px-4 py-2 border rounded w-full max-w-md text-center focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <h1 className={`text-4xl font-bold ${scannedGuest ? 'text-green-700' : 'text-red-700'}`}>{message}</h1>
          </div>
        )}

        {/* Button to toggle between Admin and User views */}
        <button
          onClick={() => setAdminView(!adminView)}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {adminView ? 'Switch to User View' : 'Switch to Admin View'}
        </button>
      </div>
    </div>
  );
};

export default GalaCheckIn;
