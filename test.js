// Example backend route
app.get('/api/check-in-guests/:email', async (req, res) => {
  const { email } = req.params;
  
  try {
    const checkedInGuest = await db.query('SELECT * FROM checked_in_guests WHERE email = $1', [email]);
    
    if (checkedInGuest.rowCount > 0) {
      res.json({ checked_in: true });
    } else {
      res.json({ checked_in: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching check-in status' });
  }
});


const handleScanInput = async (e) => {
  const input = e.target.value.trim();

  // Clear previous timeout
  if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

  // Set a new timeout
  debounceTimeoutRef.current = setTimeout(async () => {
    // Clean up the input to remove extra characters like newlines or spaces
    const sanitizedInput = input.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, "");

    if (sanitizedInput) {
      const [firstName, lastName, email] = sanitizedInput.split(',');

      // Ensure email and names are valid before proceeding
      if (firstName && lastName && email) {
        // Check if user is already in the `checked_in_guests` table
        try {
          const response = await axios.get(`http://localhost:5000/api/check-in-guests/${email}`);
          const alreadyCheckedIn = response.data.checked_in;

          if (alreadyCheckedIn) {
            setBgImage(failedBg); // Set to failed background
            setMessage(`${firstName} is already checked in!`);
            setMessageColor('text-yellow-500'); // Set color for already checked-in message
          } else {
            // If not checked in, proceed with marking as checked-in
            const foundGuest = guestList.find((guest) =>
              guest.email.toLowerCase() === email.toLowerCase() &&
              guest.first_name.toLowerCase() === firstName.toLowerCase() &&
              guest.last_name.toLowerCase() === lastName.toLowerCase()
            );

            if (foundGuest) {
              setScannedGuest(foundGuest);
              setMessage(`Welcome, ${foundGuest.first_name}!`);
              setBgImage(validBg);
              setMessageColor('text-green-500');

              // Mark as checked in in the database
              await axios.post('http://localhost:5000/api/check-in', {
                email: foundGuest.email,
                first_name: foundGuest.first_name,
                last_name: foundGuest.last_name,
              });

              // Update guest list locally
              const updatedGuestList = guestList.map((guest) =>
                guest.id === foundGuest.id ? { ...guest, checked_in: true } : guest
              );
              setGuestList(updatedGuestList);
            } else {
              setScannedGuest(null);
              setMessage(`${firstName} is not on the guest list!`);
              setBgImage(failedBg);
              setMessageColor('text-red-500');
            }
          }
        } catch (error) {
          console.error('Error checking check-in status:', error.response ? error.response.data : error.message);
        }
      }
    }

    // Reset input and flash color after processing
    setTimeout(() => {
      setBgImage(defaultBg);
      setMessage('');
      e.target.value = ''; // Clear the input field
    }, 800);
  }, 200);
};
