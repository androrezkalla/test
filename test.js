import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const CheckInSystem = () => {
  const [guestList, setGuestList] = useState([]);
  const [scannedGuest, setScannedGuest] = useState(null);
  const [message, setMessage] = useState('');
  const [adminView, setAdminView] = useState(false);

  // Fetch guest list from the database
  const fetchGuestList = async () => {
    try {
      const response = await axios.get('/api/guests'); // Update with your actual endpoint
      if (Array.isArray(response.data)) {
        setGuestList(response.data);
      } else {
        console.error('Expected an array but received:', response.data);
      }
    } catch (err) {
      console.error('Error fetching guest list:', err);
    }
  };

  // Upload Excel file and save guest list to the database
  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const guests = XLSX.utils.sheet_to_json(sheet);

      try {
        // Upload the guest list to the backend
        await axios.post('/api/upload', { guests });
        alert('Guest list uploaded successfully!');
        fetchGuestList(); // Refresh the guest list after upload
      } catch (err) {
        console.error('Error uploading guest list:', err);
        alert('Failed to upload guest list');
      }
    };
    reader.readAsBinaryString(file);
  };

  // Handle the QR code scan input
  const handleScanInput = async (e) => {
    const input = e.target.value.trim();
    if (input) {
      const [firstName, lastName, email] = input.split(',');
      try {
        // Check if the guest exists in the database
        const response = await axios.get(`/api/check?email=${email}`);
        if (response.data.onList) {
          setScannedGuest(response.data);
          setMessage(`Welcome, ${response.data.firstName}!`);
        } else {
          setScannedGuest(null);
          setMessage(`${firstName} is not on the guest list!`);
        }
      } catch (err) {
        console.error('Error checking guest:', err);
        setMessage('Error checking guest!');
      }
    }
    e.target.value = ''; // Clear the input after processing
  };

  // Send an email (functionality placeholder)
  const sendEmail = async (guest) => {
    try {
      await axios.post('/api/send-email', { guest });
      alert(`Email sent to ${guest.email}`);
    } catch (err) {
      console.error('Error sending email:', err);
      alert(`Failed to send email to ${guest.email}`);
    }
  };

  // Fetch the guest list on initial render if in admin view
  useEffect(() => {
    if (adminView) {
      fetchGuestList();
    }
  }, [adminView]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {adminView ? (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4">Admin Section</h2>
          <div className="mb-4">
            <input type="file" accept=".xlsx" onChange={handleUpload} className="mb-2" />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4">First Name</th>
                  <th className="py-2 px-4">Last Name</th>
                  <th className="py-2 px-4">Email</th>
                  <th className="py-2 px-4">Send Email</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(guestList) && guestList.length > 0 ? (
                  guestList.map((guest, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4">{guest.first_name}</td>
                      <td className="py-2 px-4">{guest.last_name}</td>
                      <td className="py-2 px-4">{guest.email}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => sendEmail(guest)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Send Email
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-2 px-4 text-center">
                      No guests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className={`min-h-screen w-full flex flex-col items-center justify-between ${
            scannedGuest ? 'bg-green-500' : 'bg-red-500'
          } p-4`}
        >
          <h1 className="text-white text-4xl font-bold flex-grow flex items-center justify-center">
            {message}
          </h1>
          <input
            type="text"
            onChange={handleScanInput}
            autoFocus
            className="opacity-0"
            style={{ height: 0, width: 0 }}
          />
        </div>
      )}

      <button
        onClick={() => setAdminView(!adminView)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
      >
        {adminView ? 'Switch to User View' : 'Switch to Admin View'}
      </button>
    </div>
  );
};

export default CheckInSystem;
