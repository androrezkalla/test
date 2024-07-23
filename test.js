import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faSave, faTimes, faFileExcel, faUser, faSync } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';

const CentralDatabase = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [editAssetId, setEditAssetId] = useState(null);
  const [editAssetNumber, setEditAssetNumber] = useState('');
  const [editLoginId, setEditLoginId] = useState('');
  const [editBusinessGroup, setEditBusinessGroup] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [loadingUserInfo, setLoadingUserInfo] = useState('');
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);
  const [loadingAllUsersByEmpID, setLoadingAllUsersByEmpID] = useState(false);

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

  const handleFetchAllUserInfo = async () => {
    setLoadingAllUsers(true);
    const userInfoPromises = assets.map(asset => handleFetchUserInfo(asset.login_id));
    await Promise.all(userInfoPromises);
    setLoadingAllUsers(false);
  };

  const handleFetchAllUsersByEmployeeID = async () => {
    setLoadingAllUsersByEmpID(true);
    const employeeIdPromises = assets.map(asset => handleFetchUserInfoByEmployeeID(asset.employee_id));
    await Promise.all(employeeIdPromises);
    setLoadingAllUsersByEmpID(false);
  };

  const handleFetchUserInfoByEmployeeID = async (employeeID) => {
    setLoadingUserInfo(employeeID);
    try {
      const response = await fetch('http://localhost:5000/api/run-powershell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          script: `Get-ADUser -Filter {EmployeeID -eq '${employeeID}'} -Properties * | Select GivenName,Surname,SamAccountName,EmployeeID,HomeDirectory,SID`
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          [employeeID]: formatUserInfo(data.output)
        }));
      } else {
        console.error('Failed to fetch user info by EmployeeID:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch user info by EmployeeID:', error);
    } finally {
      setLoadingUserInfo('');
    }
  };

  const formatUserInfo = (output) => {
    return output
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
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

      {/* Action Buttons */}
      <div className="mb-4 text-right">
        <button
          onClick={handleExportToExcel}
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-green-600 text-gray-100 hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
        >
          <FontAwesomeIcon icon={faFileExcel} className="mr-2" />Export to Excel
        </button>
        <button
          onClick={handleFetchAllUserInfo}
          className={`ml-4 px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 text-gray-100 hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          <FontAwesomeIcon icon={faSync} className="mr-2" />Fetch All User Info
        </button>
        <button
          onClick={handleFetchAllUsersByEmployeeID}
          className={`ml-4 px-4 py-2 rounded-md ${darkMode ? 'bg-purple-600 text-gray-100 hover:bg-purple-700' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
        >
          <FontAwesomeIcon icon={faSync} className="mr-2" />Fetch All Users by Employee ID
        </button>
      </div>

      {/* Assets Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Employee ID</th>
              <th className="px-6 py-3">Business Group</th>
              <th className="px-6 py-3">Asset Number</th>
              <th className="px-6 py-3">Login ID</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className={`bg-white dark:bg-gray-800 ${editAssetId === asset.id ? 'bg-gray-100 dark:bg-gray-900' : ''}`}>
                <td className="px-6 py-4">{asset.employee_id}</td>
                <td className="px-6 py-4">{editAssetId === asset.id ? (
                  <input
                    type="text"
                    value={editBusinessGroup}
                    onChange={(e) => setEditBusinessGroup(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Business Group"
                  />
                ) : (
                  asset.business_group
                )}</td>
                <td className="px-6 py-4">{editAssetId === asset.id ? (
                  <input
                    type="text"
                    value={editAssetNumber}
                    onChange={(e) => setEditAssetNumber(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Asset Number"
                  />
                ) : (
                  asset.asset_number
                )}</td>
                <td className="px-6 py-4">{editAssetId === asset.id ? (
                  <input
                    type="text"
                    value={editLoginId}
                    onChange={(e) => setEditLoginId(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                    placeholder="Login ID"
                  />
                ) : (
                  asset.login_id
                )}</td>
                <td className="px-6 py-4">
                  {editAssetId === asset.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(asset.id)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="ml-2 text-red-500 hover:text-red-600"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditAsset(asset.id, asset.asset_number, asset.login_id, asset.business_group)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="ml-2 text-red-500 hover:text-red-600"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Info Display */}
      <div className="mt-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">User Information</h2>
        {Object.keys(userInfo).map((key) => (
          <div key={key} className="mb-2 p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
            <h3 className="font-semibold">{key}</h3>
            <pre className="whitespace-pre-wrap">{userInfo[key]}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CentralDatabase;
