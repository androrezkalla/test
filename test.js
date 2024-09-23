const handleScanInput = (e) => {
  const input = e.target.value.trim();
  
  if (!input) return;

  // Split the input into first name, last name, and email
  const [firstName, lastName, email] = input.split(',').map(part => part.trim());

  // Search for the guest in the guestList
  const foundGuest = guestList.find(
    (guest) =>
      guest.email.toLowerCase() === email.toLowerCase() &&
      guest.first_name.toLowerCase() === firstName.toLowerCase() &&
      guest.last_name.toLowerCase() === lastName.toLowerCase()
  );

  if (foundGuest) {
    if (foundGuest.checked_in) {
      // Guest is already checked in
      setBgImage(failedBg); // Set to failed background
      setMessage(`${foundGuest.first_name} is already checked in!`);
      setMessageColor('text-yellow-500'); // Change text color to yellow for warning
    } else {
      // Mark the guest as checked in
      setBgImage(successBg); // Set to success background
      setMessage(`Welcome, ${foundGuest.first_name}!`);
      setMessageColor('text-green-500'); // Set text color to green for success

      // Call the backend to mark the guest as checked in
      markAsCheckedIn(foundGuest.id);

      // Update the local guestList to reflect the checked-in status
      const updatedGuestList = guestList.map((guest) =>
        guest.id === foundGuest.id ? { ...guest, checked_in: true } : guest
      );
      setGuestList(updatedGuestList); // Update the state with the new guest list
    }
  } else {
    // Guest not found
    setBgImage(failedBg); // Set to failed background
    setMessage(`${firstName} is not on the guest list!`);
    setMessageColor('text-red-500'); // Set text color to red for failure
  }

  // Reset the background and message after 2 seconds
  setTimeout(() => {
    setBgImage(standardBg); // Reset background to default
    setMessage(''); // Clear the message
    setMessageColor('text-white'); // Reset text color to default
  }, 2000);

  e.target.value = ''; // Clear the input field after handling the scan
};

// Function to mark guest as checked-in in the backend
const markAsCheckedIn = async (guestId) => {
  try {
    await axios.put(`http://localhost:5000/api/mark-checked-in/${guestId}`);
  } catch (error) {
    console.error('Error marking guest as checked in:', error);
  }
};





// Backend route to mark guest as checked-in
app.put('/api/mark-checked-in/:id', async (req, res) => {
  const guestId = req.params.id;

  try {
    // Update the guest's checked_in status to true
    await db.query('UPDATE guests SET checked_in = true WHERE id = $1', [guestId]);
    res.status(200).json({ message: 'Guest marked as checked-in successfully' });
  } catch (error) {
    console.error('Error marking guest as checked in:', error);
    res.status(500).json({ error: 'Error updating check-in status' });
  }
});
