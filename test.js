const xlsx = require('xlsx');

const exportCheckedInGuests = (checkedInGuests) => {
  // Format the check-in times
  const formattedGuests = checkedInGuests.map(guest => ({
    first_name: guest.first_name,
    last_name: guest.last_name,
    email: guest.email,
    check_in_time: new Date(guest.check_in_time).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }));

  // Convert to worksheet
  const worksheet = xlsx.utils.json_to_sheet(formattedGuests);

  // Create a new workbook and append the worksheet
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'CheckedInGuests');

  // Write to a file (or send as a response)
  xlsx.writeFile(workbook, 'checked_in_guests.xlsx');
};
