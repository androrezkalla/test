import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const GalaCheckIn = () => {
  const [guestList, setGuestList] = useState([]);
  const [adminView, setAdminView] = useState(true);
  const [scannedGuest, setScannedGuest] = useState(null);
  const [message, setMessage] = useState('');
  const [flashColor, setFlashColor] = useState('bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'); // Default to gradient background
  const debounceTimeoutRef = useRef(null); // Ref to keep track of debounce timeout

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

  // Handle the scan input for the user view with debouncing
  const handleScanInput = async (e) => {
    const input = e.target.value.trim();

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(async () => {
      // Clean up the input to remove extra characters like newlines or spaces
      const sanitizedInput = input.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "");

      if (sanitizedInput) {
        const [firstName, lastName, email] = sanitizedInput.split(',');

        // Ensure email and names are valid before proceeding
        if (firstName && lastName && email) {
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

            // Mark as checked in
            try {
              await axios.post('http://localhost:5000/api/check-in', { email });
            } catch (error) {
              console.error('Error marking check-in status:', error);
            }
          } else {
            setScannedGuest(null);
            setMessage(`${firstName} is not on the guest list!`);
            setFlashColor('bg-red-900');
          }

          // Reset input and flash color after processing
          setTimeout(() => {
            setFlashColor('bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'); // Reset to gradient
            setMessage('');
            e.target.value = ''; // Clear the input field
          }, 2000);
        }
      }
    }, 300); // Delay to wait before processing (300ms)
  };

  return (
    <div className={`min-h-screen w-full ${flashColor} flex flex-col items-center justify-center p-4 transition-colors duration-300`}>
      {adminView ? (
        // Admin View
        <div className="w-full max-w-5xl">
          {/* Admin content */}
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
          <h1 className="text-4xl font-bold text-white">{message}</h1>
          {/* Barely visible input strip at the bottom */}
          <input
            type="text"
            placeholder="Scan QR Code Here"
            onChange={handleScanInput} // Use onChange to trigger debounce
            className="fixed bottom-1 w-full bg-transparent text-transparent outline-none focus:outline-none"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default GalaCheckIn;
