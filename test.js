const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());

app.post('/api/getUserDetails', (req, res) => {
  const { sid } = req.body;

  if (!sid) {
    return res.status(400).send('SID is required');
  }

  const script = `
    $sid = "${sid}"
    $user = Get-ADUser -Filter {ObjectSID -eq $sid} -Properties * | Select-Object GivenName,Surname,SamAccountName,HomeDirectory
    if ($user) {
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

  exec(`powershell -ExecutionPolicy Bypass -NoProfile -Command "${script}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send(error.message);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send(stderr);
    }

    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (err) {
      console.error(`Error parsing JSON: ${err}`);
      res.status(500).send('Error parsing JSON response from PowerShell');
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
