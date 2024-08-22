app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  console.log('Uploaded file path:', filePath); // Debug statement

  try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: '' });

      console.log('Parsed JSON data:', jsonData); // Debug statement

      // Start a transaction
      const client = await pool.connect();
      try {
          await client.query('BEGIN');

          for (let row of jsonData) {
              const { AssetNumber, LoginID, BusinessGroup, EmployeeID } = row;

              console.log('Processing row:', { AssetNumber, LoginID, BusinessGroup, EmployeeID }); // Debug statement

              if (AssetNumber && LoginID && BusinessGroup && EmployeeID) {
                  await client.query(
                      'INSERT INTO your_table_name (asset_number, login_id, business_group, employee_id) VALUES ($1, $2, $3, $4)',
                      [AssetNumber, LoginID, BusinessGroup, EmployeeID]
                  );
              }
          }

          await client.query('COMMIT');
          res.send('File uploaded and data inserted successfully');
      } catch (error) {
          await client.query('ROLLBACK');
          console.error('Error inserting data into database:', error);
          res.status(500).send('Error inserting data into database');
      } finally {
          client.release();
      }
  } catch (error) {
      console.error('Error processing file:', error);
      res.status(500).send('Server error');
  } finally {
      // Clean up the uploaded file
      fs.unlink(filePath, (err) => {
          if (err) console.error('Error removing file:', err);
      });
  }
});
