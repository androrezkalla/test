import React, { useState } from 'react';

const UserDataRetrieval = ({ darkMode }) => {
  const [loginsIds, setLoginsIds] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleScriptExecution = async () => {
    setLoading(true);
    setError('');
    setOutput('');

    const loginIdsArray = loginsIds.split(' ').filter(id => id.trim() !== ''); // Split by space and filter out empty values

    // Validate input
    if (loginIdsArray.length === 0) {
      setError('Please enter one or more login IDs separated by spaces');
      setLoading(false);
      return;
    }

    // Construct PowerShell script to retrieve data for each login ID
    const script = loginIdsArray.map(id => `Get-ADUser -Filter {SamAccountName -eq '${id}'} -Properties * | Select GivenName,Surname,SamAccountName,EmployeeID,HomeDirectory,SID`);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/run-powershell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ script }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Failed to execute the script');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container mx-auto p-6 max-w-4xl ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 mt-20 text-center text-gray-900 dark:text-gray-100">
        User Data Retrieval
      </h1>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <form onSubmit={(e) => { e.preventDefault(); handleScriptExecution(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter Login IDs (separated by spaces)
            </label>
            <textarea
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'
              }`}
              rows="4"
              value={loginsIds}
              onChange={(e) => setLoginsIds(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className={`flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Running...' : 'Run Script'}
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-200 dark:bg-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Output</h2>
          </div>
          <div className="p-4 overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-300 p-2 bg-white dark:bg-gray-700 rounded-lg overflow-auto">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDataRetrieval;
