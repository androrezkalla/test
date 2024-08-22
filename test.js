import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSync, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const OnboardingReadiness = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [groupedAssets, setGroupedAssets] = useState({});
  const [editAssetId, setEditAssetId] = useState(null);
  const [editAssetData, setEditAssetData] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingAssetId, setSavingAssetId] = useState(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/assets');
      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }
      const data = await response.json();
      setAssets(data);
      groupAssetsByOnboardingDate(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupAssetsByOnboardingDate = (assets) => {
    const grouped = assets.reduce((acc, asset) => {
      const date = asset.onboarding_date || 'No Date Assigned';
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(asset);
      return acc;
    }, {});
    setGroupedAssets(grouped);
  };

  const calculateReadinessStats = (assets) => {
    const total = assets.length;
    const ready = assets.filter(
      (asset) =>
        asset.imaging_complete &&
        asset.ynx1c_complete &&
        asset.business_bundles_complete &&
        asset.rsa_complete
    ).length;
    return { total, ready };
  };

  const handleEditAsset = (asset) => {
    setEditAssetId(asset.id);
    setEditAssetData({
      imaging_complete: asset.imaging_complete,
      ynx1c_complete: asset.ynx1c_complete,
      business_bundles_complete: asset.business_bundles_complete,
      rsa_complete: asset.rsa_complete,
    });
  };

  const handleCancelEdit = () => {
    setEditAssetId(null);
    setEditAssetData({});
  };

  const handleSaveEdit = async (assetId) => {
    setSavingAssetId(assetId);
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${assetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editAssetData),
      });
      if (!response.ok) {
        throw new Error('Failed to save asset');
      }
      const updatedAsset = await response.json();
      const updatedAssets = assets.map((asset) =>
        asset.id === assetId ? updatedAsset : asset
      );
      setAssets(updatedAssets);
      groupAssetsByOnboardingDate(updatedAssets);
      setEditAssetId(null);
      setEditAssetData({});
    } catch (error) {
      console.error('Failed to edit asset:', error);
    } finally {
      setSavingAssetId(null);
    }
  };

  const handleToggleCheckbox = (field) => {
    setEditAssetData((prevData) => ({
      ...prevData,
      [field]: !prevData[field],
    }));
  };

  return (
    <div className={`container mx-auto p-4 max-w-screen-lg ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Onboarding Readiness
      </h1>

      <div className="mb-4 text-right">
        <button
          onClick={fetchAssets}
          className={`px-4 py-2 rounded-md ${
            darkMode
              ? 'bg-blue-600 text-gray-100 hover:bg-blue-700'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faSync} className="mr-2" />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-700 dark:text-gray-300">Loading assets...</div>
      ) : Object.keys(groupedAssets).length === 0 ? (
        <div className="text-center text-gray-700 dark:text-gray-300">
          No assets available.
        </div>
      ) : (
        Object.entries(groupedAssets).map(([date, assets]) => {
          const stats = calculateReadinessStats(assets);
          return (
            <div
              key={date}
              className={`mb-6 p-4 border rounded-md ${
                darkMode ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300'
              }`}
            >
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Onboarding Date: {date}
                </h2>
                <div
                  className={`text-lg font-medium ${
                    stats.ready === stats.total ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  {stats.ready} / {stats.total} Ready
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                  <thead>
                    <tr>
                      <th
                        className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Asset Number
                      </th>
                      <th
                        className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Login ID
                      </th>
                      <th
                        className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Imaging
                      </th>
                      <th
                        className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        YNX1C
                      </th>
                      <th
                        className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Business Bundles
                      </th>
                      <th
                        className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        RSA
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {assets.map((asset) => (
                      <tr key={asset.id}>
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                          {asset.asset_number}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                          {asset.login_id}
                        </td>
                        {editAssetId === asset.id ? (
                          <>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={editAssetData.imaging_complete}
                                onChange={() => handleToggleCheckbox('imaging_complete')}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={editAssetData.ynx1c_complete}
                                onChange={() => handleToggleCheckbox('ynx1c_complete')}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={editAssetData.business_bundles_complete}
                                onChange={() =>
                                  handleToggleCheckbox('business_bundles_complete')
                                }
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <input
                                type="checkbox"
                                checked={editAssetData.rsa_complete}
                                onChange={() => handleToggleCheckbox('rsa_complete')}
                                className="form-checkbox h-5 w-5 text-blue-600"
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => handleSaveEdit(asset.id)}
                                  className={`p-2 rounded-md ${
                                    darkMode
                                      ? 'bg-green-600 text-gray-100 hover:bg-green-700'
                                      : 'bg-green-500 text-white hover:bg-green-600'
                                  }`}
                                  disabled={savingAssetId === asset.id}
                                >
                                  {savingAssetId === asset.id ? (
                                    <FontAwesomeIcon icon={faSync} spin />
                                  ) : (
                                    <FontAwesomeIcon icon={faSave} />
                                  )}
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className={`p-2 rounded-md ${
                                    darkMode
                                      ? 'bg-red-600 text-gray-100 hover:bg-red-700'
                                      : 'bg-red-500 text-white hover:bg-red-600'
                                  }`}
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-2 text-center">
                              <FontAwesomeIcon
                                icon={
                                  asset.imaging_complete ? faCheckCircle : faTimesCircle
                                }
                                className={`${
                                  asset.imaging_complete ? 'text-green-500' : 'text-red-500'
                                } h-5 w-5`}
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <FontAwesomeIcon
                                icon={
                                  asset.ynx1c_complete ? faCheckCircle : faTimesCircle
                                }
                                className={`${
                                  asset.ynx1c_complete ? 'text-green-500' : 'text-red-500'
                                } h-5 w-5`}
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <FontAwesomeIcon
                                icon={
                                  asset.business_bundles_complete
                                    ? faCheckCircle
                                    : faTimesCircle
                                }
                                className={`${
                                  asset.business_bundles_complete
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                } h-5 w-5`}
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <FontAwesomeIcon
                                icon={asset.rsa_complete ? faCheckCircle : faTimesCircle}
                                className={`${
                                  asset.rsa_complete ? 'text-green-500' : 'text-red-500'
                                } h-5 w-5`}
                              />
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                onClick={() => handleEditAsset(asset)}
                                className={`p-2 rounded-md ${
                                  darkMode
                                    ? 'bg-blue-600 text-gray-100 hover:bg-blue-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                              >
                                <FontAwesomeIcon icon={faSync} />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default OnboardingReadiness;
