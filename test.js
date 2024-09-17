const handleScanInput = async (e) => {
  let input = e.target.value.trim();

  // Clean up the input to remove extra characters like newlines or spaces
  input = input.replace(/(\r\n|\n|\r)/gm, ""); // Remove newline characters
  input = input.replace(/\s+/g, ""); // Remove extra spaces

  // Process the input only if it contains text
  if (input) {
    const [firstName, lastName, email] = input.split(',');

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
    } else {
      // If the input is invalid, reset the input field immediately
      e.target.value = ''; // Clear the input field
    }
  }
};
