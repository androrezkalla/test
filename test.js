import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const OnboardingReadiness = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [groupedAssets, setGroupedAssets] = useState({});
  const [loading, setLoading] = useState(false);

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

  const isDeploymentReady = (asset) => {
    return (
      asset.imaging_complete &&
      asset.ynx1c_complete &&
      asset.business_bundles_complete &&
      asset.rsa_complete
    );
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
                        rowSpan="2"
                      >
                        Asset Number
                      </th>
                      <th
                        className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                        rowSpan="2"
                      >
                        Login ID
                      </th>
                      <th
                        className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                        colSpan="2"
                      >
                        Asset Readiness
                      </th>
                      <th
                        className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                        colSpan="2"
                      >
                        User Readiness
                      </th>
                      <th
                        className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                        rowSpan="2"
                      >
                        Deployment Ready
                      </th>
                    </tr>
                    <tr>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        Imaging
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        YNX1C
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        Business Bundles
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        RSA
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
                              asset.business_bundles_complete ? faCheckCircle : faTimesCircle
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
                            icon={
                              asset.rsa_complete ? faCheckCircle : faTimesCircle
                            }
                            className={`${
                              asset.rsa_complete ? 'text-green-500' : 'text-red-500'
                            } h-5 w-5`}
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <FontAwesomeIcon
                            icon={isDeploymentReady(asset) ? faCheckCircle : faTimesCircle}
                            className={`${
                              isDeploymentReady(asset) ? 'text-green-500' : 'text-red-500'
                            } h-5 w-5`}
                          />
                        </td>
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
