// Update check-in status
app.post('/api/check-in', async (req, res) => {
  const { email } = req.body; // Assuming the email is used to identify the guest

  try {
    const result = await db.query(
      'UPDATE guests SET checked_in = TRUE WHERE email = $1 RETURNING *',
      [email]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Guest not found' });
    }
  } catch (error) {
    console.error('Error updating check-in status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch the guest list with check-in status
app.get('/api/get-guest-list', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM guests');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching guest list:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});







import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GalaCheckIn = () => {
  const [guestList, setGuestList] = useState([]);
  const [adminView, setAdminView] = useState(true);
  const [scannedGuest, setScannedGuest] = useState(null);
  const [message, setMessage] = useState('');
  const [flashColor, setFlashColor] = useState('bg-gradient-to-r from-purple-400 via-pink-500 to-red-500');

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
      fetchGuestList();
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

        // Update the check-in status in the backend
        await axios.post('http://localhost:5000/api/check-in', { email });
      } else {
        setScannedGuest(null);
        setMessage(`${firstName} is not on the guest list!`);
        setFlashColor('bg-red-900');
      }

      setTimeout(() => {
        setFlashColor('bg-gradient-to-r from-purple-400 via-pink-500 to-red-500');
        setMessage('');
      }, 2000);

    }
    e.target.value = '';
  };

  return (
    <div
      className={`min-h-screen w-full ${flashColor} flex flex-col items-center justify-center p-4 transition-colors duration-300`}
    >
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
                    <th className="py-3 px-4 text-left font-medium text-white">Checked In</th>
                  </tr>
                </thead>
                <tbody>
                  {guestList.map((guest, index) => (
                    <tr key={index} className="border-b border-gray-600 hover:bg-gray-600">
                      <td className="py-3 px-4">{guest.first_name}</td>
                      <td className="py-3 px-4">{guest.last_name}</td>
                      <td className="py-3 px-4">{guest.email}</td>
                      <td className="py-3 px-4">{guest.checked_in ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
          <div className="absolute top-4 left-4">
            <img src="/images/logo.png" alt="Logo" className="w-24 h-24 rounded-full" />
          </div>

          {!message ? (
            <h1 className="text-5xl font-bold text-white mb-8">Welcome to the Gala</h1>
          ) : null}

          <h1 className="text-4xl font-bold text-white">{message}</h1>
          
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
