app.post('/api/get-asset-info', (req, res) => {
  const { hostname } = req.body;

  if (!hostname) {
    return res.status(400).send({ success: false, error: 'Hostname is required' });
  }

  const script = `$hostname = "${hostname}"; $computerSystem = Get-CimInstance -ClassName Win32_ComputerSystem -ComputerName $hostname; $os = Get-CimInstance -ClassName Win32_OperatingSystem -ComputerName $hostname; $ipAddresses = (Get-CimInstance -ClassName Win32_NetworkAdapterConfiguration -ComputerName $hostname | Where-Object { $_.IPAddress }).IPAddress; $applications = Get-CimInstance -ClassName Win32_Product -ComputerName $hostname | Select-Object -Property Name; $result = @{ Hostname = $hostname; Owner = $computerSystem.UserName; WindowsVersion = $os.Caption; IP = $ipAddresses -join ", "; Applications = $applications | ForEach-Object { $_.Name } }; $result | ConvertTo-Json`;

  exec(`powershell -Command "${script}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      return res.status(500).send({ success: false, error: stderr });
    }

    try {
      const output = JSON.parse(stdout);
      res.send({ success: true, ...output });
    } catch (parseError) {
      console.error(`Error parsing JSON response: ${parseError}`);
      res.status(500).send({ success: false, error: 'Invalid JSON response from PowerShell script' });
    }
  });
});