const express = require('express');
const bodyParser = require('body-parser');
const PowerShell = require('node-powershell');

const app = express();
app.use(bodyParser.json());

app.post('/api/getUserDetails', async (req, res) => {
  const { sid } = req.body;

  if (!sid) {
    return res.status(400).send('SID is required');
  }

  const ps = new PowerShell({
    executionPolicy: 'Bypass',
    noProfile: true
  });

  const script = `
    $sid = "${sid}"
    $user = Get-ADUser -Filter {ObjectSID -eq $sid} -Properties * | Select GivenName,Surname,SamAccountName,HomeDirectory
    if($user){
      $result = @{
        status = "User Found"
        GivenName = $user.GivenName
        Surname = $user.Surname
        SamAccountName = $user.SamAccountName
        HomeDirectory = $user.HomeDirectory
      }
    }
    else {
      $result = @{
        status = "Not Found"
      }
    }
    $result | ConvertTo-Json
  `;

  ps.addCommand(script);

  try {
    const output = await ps.invoke();
    const result = JSON.parse(output);
    res.json(result);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    ps.dispose();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





\\\\\\

import React, { useState } from 'react';
import axios from 'axios';

const GetUserDetailsForm = () => {
  const [sid, setSid] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/getUserDetails', { sid });
      setResult(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter SID"
          value={sid}
          onChange={(e) => setSid(e.target.value)}
        />
        <button type="submit">Get User Details</button>
      </form>
      {result && (
        <div>
          <h3>{result.status}</h3>
          {result.status === 'User Found' && (
            <div>
              <p>Name: {result.GivenName} {result.Surname}</p>
              <p>LoginID: {result.SamAccountName}</p>
              <p>Home Directory: {result.HomeDirectory}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GetUserDetailsForm;
