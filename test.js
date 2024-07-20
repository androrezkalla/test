import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';

const CentralDatabase = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [businessGroups, setBusinessGroups] = useState([]);
  const [selectedBusinessGroup, setSelectedBusinessGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);
  const [loadingUserInfo, setLoadingUserInfo] = useState('');
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    // Fetch assets
    axios.get('/api/assets')
      .then(response => setAssets(response.data))
      .catch(error => console.error('Error fetching assets:', error));

    // Fetch business groups
    axios.get('/api/business-groups')
      .then(response => setBusinessGroups(response.data))
      .catch(error => console.error('Error fetching business groups:', error));
  }, []);

  const handleFetchUserInfo = async (loginId) => {
    setLoadingUserInfo(loginId);
    try {
      const response = await fetch('http://localhost:5000/api/run-powershell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          script: `Get-ADUser -Filter {SamAccountName -eq '${loginId}'} -Properties * | Select GivenName,Surname,SamAccountName,EmployeeID,HomeDirectory,SID`
        }),
      });

      const data = await response.json();

      if (response.ok && data.output) {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          [loginId]: formatUserInfo(data.output)
        }));
      } else {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          [loginId]: 'No User Found'
        }));
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        [loginId]: 'No User Found'
      }));
    } finally {
      setLoadingUserInfo('');
    }
  };

  const handleFetchAllUserInfo = async () => {
    setLoadingAllUsers(true);

    const userInfoPromises = assets.map(async (asset) => {
      if (asset.login_id) {
        await handleFetchUserInfo(asset.login_id);
      } else {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          [asset.id]: 'No User Found'
        }));
      }
    });

    await Promise.all(userInfoPromises);
    setLoadingAllUsers(false);
  };

  const formatUserInfo = (info) => {
    return info.split('\r\n').map((line, index) => (
      <div key={index}>{line}</div>
    ));
  };

  const filteredAssets = selectedBusinessGroup
    ? assets.filter(asset => asset.business_group === selectedBusinessGroup)
    : assets;

  return (
    <div className={`container mx-auto p-6 max-w-4xl ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 mt-20 text-center text-gray-900 dark:text-gray-100">
        Central Database
      </h1>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Business Group
          </label>
          <select
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'
            }`}
            value={selectedBusinessGroup}
            onChange={(e) => setSelectedBusinessGroup(e.target.value)}
          >
            <option value="">All</option>
            {businessGroups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={handleFetchAllUserInfo}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={loadingAllUsers}
          >
            {loadingAllUsers ? 'Fetching All Users...' : 'Fetch All User Info'}
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Asset Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Login ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Business Group
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAssets.map((asset) => (
              <tr key={asset.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                  {asset.asset_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {asset.login_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {asset.business_group}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleFetchUserInfo(asset.login_id)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-500"
                    disabled={loadingUserInfo === asset.login_id}
                  >
                    {loadingUserInfo === asset.login_id ? 'Fetching...' : 'Fetch User Info'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {Object.keys(userInfo).length > 0 && (
          <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">User Info</h2>
            {Object.keys(userInfo).map((key) => (
              <div key={key} className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{key}</h3>
                <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-300">
                  {userInfo[key]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CentralDatabase;
