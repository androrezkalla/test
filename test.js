import React, { useState } from 'react';

const Assets = ({ darkMode }) => {
  const [hostname, setHostname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [assetInfo, setAssetInfo] = useState(null);

  const handleFetchAssetInfo = async () => {
    setLoading(true);
    setError('');
    setAssetInfo(null);

    try {
      const response = await fetch('http://127.0.0.1:3000/api/get-asset-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hostname }),
      });

      const data = await response.json();

      if (response.ok) {
        setAssetInfo(data.output);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to fetch asset information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container mx-auto p-6 max-w-4xl ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 mt-20 text-center text-gray-900 dark:text-gray-100">
        Asset Information
      </h1>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hostname
            </label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'
              }`}
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              required
            />
          </div>
          <button
            onClick={handleFetchAssetInfo}
            className={`flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              loading ? 'cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Fetch Asset Info'}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {assetInfo && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-200 dark:bg-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Asset Information</h2>
          </div>
          <div className="p-4 overflow-auto max-h-96">
            <table className="min-w-full bg-white dark:bg-gray-700">
              <tbody>
                <tr>
                  <td className="border px-4 py-2 text-gray-900 dark:text-gray-300">Hostname</td>
                  <td className="border px-4 py-2 text-gray-900 dark:text-gray-300">{assetInfo.Hostname}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-gray-900 dark:text-gray-300">Owner</td>
                  <td className="border px-4 py-2 text-gray-900 dark:text-gray-300">{assetInfo.Owner}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-gray-900 dark:text-gray-300">Windows Version</td>
                  <td className="border px-4 py-2 text-gray-900 dark:text-gray-300">{assetInfo.WindowsVersion}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-gray-900 dark:text-gray-300">IP Segment</td>
                  <td className="border px-4 py-2 text-gray-900 dark:text-gray-300">{assetInfo.IP}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 text-gray-900 dark:text-gray-300">Applications</td>
                  <td className="border px-4 py-2 text-gray-900 dark:text-gray-300">
                    <ul>
                      {assetInfo.Applications.map((app, index) => (
                        <li key={index}>{app.Name}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;

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
        $hostname = "${hostname}"
        $computer = Get-CimInstance -ClassName Win32_ComputerSystem -ComputerName $hostname
        $os = Get-CimInstance -ClassName Win32_OperatingSystem -ComputerName $hostname
        $network = Get-CimInstance -ClassName Win32_NetworkAdapterConfiguration -Filter "IPEnabled = 'TRUE'" -ComputerName $hostname
        $apps = Get-CimInstance -ClassName Win32_Product -ComputerName $hostname

        $result = @{
            Hostname = $hostname
            Owner = $computer.UserName
            WindowsVersion = $os.Caption
            IP = $network.IPAddress[0]
            Applications = $apps | Select-Object -Property Name
        }

        $result | ConvertTo-Json
    `;

    exec(`powershell -Command "${script}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error}`);
            return res.status(500).send({ success: false, error: stderr });
        }
        res.send({ success: true, output: JSON.parse(stdout) });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
