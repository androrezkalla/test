import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const GalaCheckIn = () => {
  const [guestList, setGuestList] = useState([]);
  const [message, setMessage] = useState('');
  const [adminView, setAdminView] = useState(false);

  // Fetch the guest list from the backend
  const fetchGuestList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/guests');
      setGuestList(response.data);
    } catch (error) {
      console.error('Error fetching guest list:', error);
      setMessage('Error fetching guest list.');
    }
  };

  useEffect(() => {
    // Fetch guest list on component mount
    fetchGuestList();
  }, []);

  // Handle the file upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/upload-guest-list', formData);
      fetchGuestList(); // Refresh the guest list after upload
      setMessage('Guest list uploaded successfully.');
    } catch (error) {
      console.error('Error uploading guest list:', error);
      setMessage('Error uploading guest list.');
    }
  };

  // Handle the manual check of the guest list
  const handleManualCheck = () => {
    alert(JSON.stringify(guestList, null, 2));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {adminView ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Admin Section</h2>
          <div className="mb-4">
            <input type="file" accept=".xlsx" onChange={handleUpload} className="mb-2" />
            <button
              onClick={handleManualCheck}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Manually Check Guest List
            </button>
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
        <div className="min-h-screen w-full flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Guest Check-In</h1>
          <p>Switch to the admin view to manage the guest list.</p>
        </div>
      )}

      <button
        onClick={() => setAdminView(!adminView)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        {adminView ? 'Switch to User View' : 'Switch to Admin View'}
      </button>
      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
};

export default GalaCheckIn;
