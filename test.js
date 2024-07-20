import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faSave, faTimes, faFileExcel, faUser } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';

const CentralDatabase = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [editAssetId, setEditAssetId] = useState(null);
  const [editAssetNumber, setEditAssetNumber] = useState('');
  const [editLoginId, setEditLoginId] = useState('');
  const [editBusinessGroup, setEditBusinessGroup] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [loadingUserInfo, setLoadingUserInfo] = useState('');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/assets');
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${assetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }
      setAssets(assets.filter((asset) => asset.id !== assetId));
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const handleEditAsset = (assetId, assetNumber, loginId, businessGroup) => {
    setEditAssetId(assetId);
    setEditAssetNumber(assetNumber);
    setEditLoginId(loginId);
    setEditBusinessGroup(businessGroup);
  };

  const handleSaveEdit = async (assetId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${assetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asset_number: editAssetNumber,
          login_id: editLoginId,
          business_group: editBusinessGroup
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save asset');
      }
      const updatedAsset = await response.json();
      setAssets(assets.map((asset) => (asset.id === assetId ? updatedAsset : asset)));
      setEditAssetId(null);
      setEditAssetNumber('');
      setEditLoginId('');
      setEditBusinessGroup('');
    } catch (error) {
      console.error('Failed to edit asset:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditAssetId(null);
    setEditAssetNumber('');
    setEditLoginId('');
    setEditBusinessGroup('');
  };

  const calculateStats = () => {
    const stats = {
      total_assets: assets.length,
      imaging_complete: 0,
      ynx1c_complete: 0,
      business_bundles_complete: 0,
      rsa_complete: 0,
    };

    assets.forEach(asset => {
      if (asset.imaging_complete) stats.imaging_complete++;
      if (asset.ynx1c_complete) stats.ynx1c_complete++;
      if (asset.business_bundles_complete) stats.business_bundles_complete++;
      if (asset.rsa_complete) stats.rsa_complete++;
    });

    return stats;
  };

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(assets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    XLSX.writeFile(wb, "assets.xlsx");
  };

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

      if (response.ok) {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          [loginId]: formatUserInfo(data.output)
        }));
      } else {
        console.error('Failed to fetch user info:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    } finally {
      setLoadingUserInfo('');
    }
  };

  const formatUserInfo = (output) => {
    // Format the output to a more readable format
    return output
      .replace(/\r\n/g, '\n') // Normalize newlines
      .split('\n') // Split into lines
      .map(line => line.trim()) // Trim each line
      .filter(line => line.length > 0) // Remove empty lines
      .join('\n'); // Join back into a single string
  };

  const stats = calculateStats();

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Central Database</h1>

      {/* Stats Bar */}
      <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Statistics</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>Total Assets: {stats.total_assets}</div>
          <div>Imaging Complete: {stats.imaging_complete}</div>
          <div>YNX1C Complete: {stats.ynx1c_complete}</div>
          <div>Business Bundles Complete: {stats.business_bundles_complete}</div>
          <div>RSA Complete: {stats.rsa_complete}</div>
        </div>
      </div>

      {/* Export to Excel Button */}
      <div className="mb-4 text-right">
        <button
          onClick={handleExportToExcel}
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-green-600 text-gray-100 hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
        >
          <FontAwesomeIcon icon={faFileExcel} className="mr-2" />Export to Excel
        </button>
      </div>

      {assets.length === 0 ? (
        <p className={`text-center ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>No assets available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <div className="flex justify-between items-center">
                <div>
                  {editAssetId === asset.id ? (
                    <>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Asset Number
                        <input
                          type="text"
                          value={editAssetNumber}
                          onChange={(e) => setEditAssetNumber(e.target.value)}
                          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
                        />
                      </label>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                        Login ID
                        <input
                          type="text"
                          value={editLoginId}
                          onChange={(e) => setEditLoginId(e.target.value)}
                          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
                        />
                      </label>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                        Business Group
                        <input
                          type="text"
                          value={editBusinessGroup}
                          onChange={(e) => setEditBusinessGroup(e.target.value)}
                          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <div>Asset Number: {asset.asset_number}</div>
                      <div>Login ID: {asset.login_id}</div>
                      <div>Business Group: {asset.business_group}</div>
                      {userInfo[asset.login_id] && (
                        <pre className="mt-2 bg-gray-100 p-2 rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                          {userInfo[asset.login_id]}
                        </pre>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {editAssetId === asset.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(asset.id)}
                        className={`p-2 rounded-md ${darkMode ? 'bg-green-600 text-gray-100 hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className={`p-2 rounded-md ${darkMode ? 'bg-red-600 text-gray-100 hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditAsset(asset.id, asset.asset_number, asset.login_id, asset.business_group)}
                        className={`p-2 rounded-md ${darkMode ? 'bg-blue-600 text-gray-100 hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className={`p-2 rounded-md ${darkMode ? 'bg-red-600 text-gray-100 hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                      <button
                        onClick={() => handleFetchUserInfo(asset.login_id)}
                        className={`p-2 rounded-md ${darkMode ? 'bg-yellow-600 text-gray-100 hover:bg-yellow-700' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
                      >
                        <FontAwesomeIcon icon={faUser} />
                        {loadingUserInfo === asset.login_id && '...'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CentralDatabase;
