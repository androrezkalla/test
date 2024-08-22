import React, { useState } from 'react';
import axios from 'axios';

const ExcelUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        }
    };

    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default ExcelUpload;



app.post('/api/upload', upload.single('file'), async (req, res) => {
  const workbook = XLSX.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const columns = {
      assetNumber: null,
      loginID: null,
      employeeID: null,
      businessGroup: null,
  };

  // Detect column indexes
  const headers = Object.keys(worksheet[0]);
  headers.forEach((header) => {
      if (/asset/i.test(header)) columns.assetNumber = header;
      if (/login/i.test(header)) columns.loginID = header;
      if (/employee/i.test(header)) columns.employeeID = header;
      if (/business/i.test(header)) columns.businessGroup = header;
  });

  if (!columns.assetNumber || !columns.loginID || !columns.employeeID || !columns.businessGroup) {
      return res.status(400).json({ message: 'Required columns not found in the uploaded file.' });
  }

  try {
      const client = await pool.connect();
      await Promise.all(
          worksheet.map(async (row) => {
              const query = `
                  INSERT INTO assets (asset_number, login_id, employee_id, business_group)
                  VALUES ($1, $2, $3, $4)
              `;
              const values = [
                  row[columns.assetNumber],
                  row[columns.loginID],
                  row[columns.employeeID],
                  row[columns.businessGroup]
              ];
              await client.query(query, values);
          })
      );
      client.release();
      res.json({ message: 'File processed and data inserted successfully.' });
  } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ message: 'Failed to insert data into the database.' });
  }
});