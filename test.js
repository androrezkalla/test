const express = require('express');
const bodyParser = require('body-parser');
const PowerShell = require('powershell');

const app = express();
app.use(bodyParser.json());

app.post('/api/getUserDetails', async (req, res) => {
  const { sid } = req.body;

  if (!sid) {
    return res.status(400).send('SID is required');
  }

  const psScript = `
    $sid = "${sid}"
    $user = Get-ADUser -Filter {ObjectSID -eq $sid} -Properties * | Select GivenName,Surname,SamAccountName,HomeDirectory
    if ($user) {
      $result = @{
        status = "User Found"
        GivenName = $user.GivenName
        Surname = $user.Surname
        SamAccountName = $user.SamAccountName
        HomeDirectory = $user.HomeDirectory
      }
    } else {
      $result = @{
        status = "Not Found"
      }
    }
    $result | ConvertTo-Json
  `;

  const ps = new PowerShell(psScript);

  let output = '';

  ps.on('output', data => {
    output += data;
  });

  ps.on('end', () => {
    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (err) {
      res.status(500).send('Error parsing PowerShell output');
    }
  });

  ps.on('error', err => {
    res.status(500).send(err);
  });

  ps.start();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
