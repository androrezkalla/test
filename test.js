// server.js (or wherever your backend routes are defined)

const express = require('express');
const router = express.Router();
const Guest = require('./models/Guest'); // Assuming you have a Guest model

// Endpoint to update the checked_in status
router.post('/api/check-in', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the guest by email and update their checked_in status
    const guest = await Guest.findOneAndUpdate(
      { email: email.toLowerCase() },
      { checked_in: true },
      { new: true } // Return the updated document
    );

    if (guest) {
      res.status(200).json({ message: 'Guest checked in successfully' });
    } else {
      res.status(404).json({ message: 'Guest not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking in guest', error });
  }
});

module.exports = router;







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
