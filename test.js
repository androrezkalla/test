import React, { useState } from 'react';

const AssetDetails = ({ darkMode }) => {
  const [hostname, setHostname] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleFetchAssetDetails = async () => {
    setLoading(true);
    setError('');
    setOutput('');

    try {
      const script = `Get-CimInstance -ClassName Win32_ComputerSystem -ComputerName '${hostname}' | Select-Object PSComputerName, Manufacturer, Model, TotalPhysicalMemory, UserName | ConvertTo-Json -Compress`;
      const response = await fetch('http://127.0.0.1:5000/api/run-powershell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script }),
      });

      const data = await response.json();

      if (response.ok) {
        // Format JSON-like output for display
        const formattedOutput = formatJsonOutput(data.output);
        setOutput(formattedOutput);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to execute the script');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format JSON-like output for display
  const formatJsonOutput = (jsonString) => {
    try {
      const parsedJson = JSON.parse(jsonString);
      return Object.keys(parsedJson)
        .map(key => `${key} : ${parsedJson[key]}`)
        .join('\n');
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return jsonString; // Return original string if parsing fails
    }
  };

  const handleFetchApplicationList = async () => {
    setLoading(true);
    setError('');
    setOutput('');

    try {
      const script = `$apps = Get-ItemProperty HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | Where-Object { $_.DisplayName -and $_.DisplayVersion -and $_.PSChildName } | Select-Object DisplayName, DisplayVersion, PSChildName | ConvertTo-Json -Compress; $apps`;
      const response = await fetch('http://127.0.0.1:5000/api/run-powershell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script }),
      });

      const data = await response.json();

      if (response.ok) {
        // Format JSON-like output for display
        const formattedOutput = formatApplicationList(data);
        setOutput(formattedOutput);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to execute the script');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format application list for display
  const formatApplicationList = (jsonData) => {
    try {
      const apps = JSON.parse(jsonData);
      return apps.map(app => {
        return Object.keys(app)
          .map(key => `${key} : ${app[key]}`)
          .join('\n');
      }).join('\n\n');
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return jsonData; // Return original string if parsing fails
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
          <div className="flex justify-between">
            <button
              onClick={handleFetchAssetDetails}
              className={`flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Fetch Asset Details'}
            </button>
            <button
              onClick={handleFetchApplicationList}
              className={`flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Fetching...' : 'Fetch Application List'}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {output && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-200 dark:bg-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Asset Information</h2>
          </div>
          <div className="p-4 overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap text-gray-900 dark:text-gray-300">
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDetails;
