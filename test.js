const exportToExcel = () => {
  // Format the check_in_time for each guest
  const formattedGuests = checkedInGuests.map(guest => ({
    ...guest,
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

  // Create worksheet from the formatted checked-in guests data
  const ws = XLSX.utils.json_to_sheet(formattedGuests);
  
  // Create a new workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Checked-In Guests');
  
  // Convert the workbook to a binary Excel file
  XLSX.writeFile(wb, 'checked_in_guests.xlsx');
};
