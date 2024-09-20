const markAsCheckedIn = async (guestId) => {
  try {
    await axios.put(`http://localhost:5000/api/mark-checked-in/${guestId}`);
  } catch (error) {
    console.error('Error marking guest as checked in:', error);
  }
};