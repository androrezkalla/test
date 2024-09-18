import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import xlsx

const GalaCheckIn = () => {
  const [guestList, setGuestList] = useState([]);
  const [checkedInGuests, setCheckedInGuests] = useState([]); // State to hold checked-in guests
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

  // Fetch the checked-in guests from the backend
  const fetchCheckedInGuests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/checked-in-guests');
      setCheckedInGuests(response.data);
    } catch (error) {
      console.error('Error fetching checked-in guests:', error);
    }
  };

  useEffect(() => {
    fetchGuestList();
    fetchCheckedInGuests(); // Fetch checked-in guests on component mount
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
  const handleScanInput = async (e) => {
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

        // Mark guest as checked-in in the backend
        try {
          await axios.post('http://localhost:5000/api/check-in', {
            email: foundGuest.email,
            first_name: foundGuest.first_name,
            last_name: foundGuest.last_name
          });
          fetchCheckedInGuests(); // Refresh the checked-in guests list
        } catch (error) {
          console.error('Error marking check-in status:', error.response ? error.response.data : error.message);
        }
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

  // Export checked-in guests to Excel
  const exportToExcel = () => {
    // Create worksheet from the checked-in guests data
    const ws = XLSX.utils.json_to_sheet(checkedInGuests);
    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Checked-In Guests');
    // Convert the workbook to a binary Excel file
    XLSX.writeFile(wb, 'checked_in_guests.xlsx');
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
            <div className="overflow-x-auto w-full mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Checked-In Guests</h3>
              <table className="min-w-full bg-gray-800 rounded-lg">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="py-3 px-4 text-left font-medium text-white">First Name</th>
                    <th className="py-3 px-4 text-left font-medium text-white">Last Name</th>
                    <th className="py-3 px-4 text-left font-medium text-white">Email</th>
                    <th className="py-3 px-4 text-left font-medium text-white">Check-In Time</th>
                  </tr>
                </thead>
                <tbody>
                  {checkedInGuests.map((guest, index) => (
                    <tr key={index} className="border-b border-gray-600 hover:bg-gray-600">
                      <td className="py-3 px-4">{guest.first_name}</td>
                      <td className="py-3 px-4">{guest.last_name}</td>
                      <td className="py-3 px-4">{guest.email}</td>
                      <td className="py-3 px-4">{new Date(guest.check_in_time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Export to Excel Button */}
            <button
              onClick={exportToExcel}
              className="mb-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Export to Excel
            </button>
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
        // User View: Only show welcome message and logo
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="mb-6">
            {/* Placeholder for Logo */}
            <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white">Logo</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-8">{message}</h1>
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
