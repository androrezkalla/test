const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/get-asset-info', (req, res) => {
    const { hostname } = req.body;

    if (!hostname) {
        return res.status(400).send({ success: false, error: 'Hostname is required' });
    }

    const script = `
        $ErrorActionPreference = "Stop"
        $hostname = "${hostname}"
        try {
            $computer = Get-CimInstance -ClassName Win32_ComputerSystem -ComputerName $hostname
            $os = Get-CimInstance -ClassName Win32_OperatingSystem -ComputerName $hostname
            $network = Get-CimInstance -ClassName Win32_NetworkAdapterConfiguration -Filter "IPEnabled = 'TRUE'" -ComputerName $hostname
            $apps = Get-CimInstance -ClassName Win32_Product -ComputerName $hostname

            $result = @{
                success = $true
                Hostname = $hostname
                Owner = $computer.UserName
                WindowsVersion = $os.Caption
                IP = $network.IPAddress[0]
                Applications = $apps | Select-Object -Property Name
            }

            $result | ConvertTo-Json
        } catch {
            $error = $_.Exception.Message
            @{ success = $false; error = $error } | ConvertTo-Json
        }
    `;

    exec(`powershell -Command "${script}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).send({ success: false, error: 'Failed to execute script' });
        }

        try {
            const output = JSON.parse(stdout);
            res.send(output);
        } catch (e) {
            console.error(`Error parsing JSON: ${e}`);
            res.status(500).send({ success: false, error: 'Invalid JSON response' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
