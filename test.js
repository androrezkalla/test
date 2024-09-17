// Backend route to handle file upload
app.post('/upload-guest-list', (req, res) => {
    if (!req.files || !req.files.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const file = req.files.file;
    const workbook = XLSX.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
  
    // Safely parse the data to avoid errors
    const guests = XLSX.utils.sheet_to_json(sheet, { header: ['FirstName', 'LastName', 'Email'] });
    if (guests.length === 0) {
      return res.status(400).send('No guests found in the uploaded file.');
    }
  
    // Insert guests into the database
    const query = 'INSERT INTO guests (first_name, last_name, email) VALUES ?';
    const values = guests.map(guest => [guest.FirstName, guest.LastName, guest.Email]);
  
    db.query(query, [values], (err, result) => {
      if (err) {
        console.error('Database insertion error:', err);
        return res.status(500).send('Error saving guests to the database.');
      }
      res.send('Guests uploaded successfully.');
    });
  });
  


  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      await axios.post('http://localhost:3001/upload-guest-list', formData);
      fetchGuestList(); // Refresh the guest list after upload
    } catch (error) {
      console.error('Error uploading guest list:', error);
    }
  };
  