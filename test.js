import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faSave, faTimes, faFileExcel, faSync } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';

const CentralDatabase = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [editAssetId, setEditAssetId] = useState(null);
  const [editAssetNumber, setEditAssetNumber] = useState('');
  const [editLoginId, setEditLoginId] = useState('');
  const [editBusinessGroup, setEditBusinessGroup] = useState('');
  const [loadingUserInfo, setLoadingUserInfo] = useState('');
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);

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

  const handleFetchUserInfo = async (employeeId) => {
    setLoadingUserInfo(employeeId);
    try {
      const response = await fetch('http://localhost:5000/api/run-powershell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          script: `Get-ADUser -Filter {EmployeeID -eq '${employeeId}'} -Properties * | Select GivenName,Surname,SamAccountName,EmployeeID,HomeDirectory,SID`
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const samAccountName = data.output.trim(); // Adjust based on actual output structure
        return samAccountName;
      } else {
        console.error('Failed to fetch user info:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      return null;
    } finally {
      setLoadingUserInfo('');
    }
  };

  const handleFetchAllUserInfo = async () => {
    setLoadingAllUsers(true);
    const updatedAssets = await Promise.all(assets.map(async (asset) => {
      if (asset.employee_id) {
        const samAccountName = await handleFetchUserInfo(asset.employee_id);
        if (samAccountName) {
          return { ...asset, login_id: samAccountName };
        }
      }
      return asset;
    }));
    setAssets(updatedAssets);
    setLoadingAllUsers(false);
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
        <button
          onClick={handleFetchAllUserInfo}
          className={`ml-4 px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 text-gray-100 hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          disabled={loadingAllUsers}
        >
          <FontAwesomeIcon icon={faSync} className="mr-2" />
          {loadingAllUsers ? 'Fetching...' : 'Fetch All Users'}
        </button>
      </div>

      {/* Asset Table */}
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Employee ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Business Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Asset Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Login ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editAssetId === asset.id ? (
                    <input
                      type="text"
                      value={asset.employee_id}
                      onChange={(e) => setEditLoginId(e.target.value)}
                      className="border border-gray-300 rounded-md p-1"
                    />
                  ) : (
                    asset.employee_id
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editAssetId === asset.id ? (
                    <input
                      type="text"
                      value={editBusinessGroup}
                      onChange={(e) => setEditBusinessGroup(e.target.value)}
                      className="border border-gray-300 rounded-md p-1"
                    />
                  ) : (
                    asset.business_group
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editAssetId === asset.id ? (
                    <input
                      type="text"
                      value={editAssetNumber}
                      onChange={(e) => setEditAssetNumber(e.target.value)}
                      className="border border-gray-300 rounded-md p-1"
                    />
                  ) : (
                    asset.asset_number
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editAssetId === asset.id ? (
                    <input
                      type="text"
                      value={editLoginId}
                      onChange={(e) => setEditLoginId(e.target.value)}
                      className="border border-gray-300 rounded-md p-1"
                    />
                  ) : (
                    asset.login_id
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editAssetId === asset.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(asset.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditAsset(asset.id, asset.asset_number, asset.login_id, asset.business_group)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="ml-2 text-red-600 hover:text-red-900"
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
    </div>
  );
};

export default CentralDatabase;
