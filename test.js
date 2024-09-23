const handleScanInput = (input) => {
  const [firstName, lastName, email] = input.split(',').map(part => part.trim());

  const foundGuest = guestList.find(
    (guest) =>
      guest.email.toLowerCase() === email.toLowerCase() &&
      guest.first_name.toLowerCase() === firstName.toLowerCase() &&
      guest.last_name.toLowerCase() === lastName.toLowerCase()
  );

  if (foundGuest) {
    if (foundGuest.checked_in) {
      setBgImage(failedBg); // Set to failed background
      setMessage(`${foundGuest.first_name} is already checked in!`);
      setMessageColor('text-yellow-500'); // Change text color to yellow to indicate warning
    } else {
      // Mark the guest as checked in
      setBgImage(successBg); // Set to success background
      setMessage(`Welcome, ${foundGuest.first_name}!`);
      setMessageColor('text-green-500');

      // Mark the guest as checked in in the backend
      markAsCheckedIn(foundGuest.id);

      // Update the local guestList to reflect the checked-in status
      const updatedGuestList = guestList.map((guest) =>
        guest.id === foundGuest.id ? { ...guest, checked_in: true } : guest
      );
      setGuestList(updatedGuestList);
    }
  } else {
    setBgImage(failedBg); // Set to failed background
    setMessage(`${firstName} is not on the guest list!`);
    setMessageColor('text-red-500');
  }

  // Reset the background and message after 2 seconds
  setTimeout(() => {
    setBgImage(standardBg); // Reset background
    setMessage('');
    setMessageColor('text-white'); // Reset text color
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
