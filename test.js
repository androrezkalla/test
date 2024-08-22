import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const AssetReadiness = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [groupedAssets, setGroupedAssets] = useState({});

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
      groupAssetsByOnboardingDate(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  const groupAssetsByOnboardingDate = (assets) => {
    const grouped = assets.reduce((acc, asset) => {
      const date = asset.onboarding_date;
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
      asset =>
        asset.ynx1c_complete &&
        asset.rsa_complete &&
        asset.business_bundles_complete &&
        asset.imaging_complete
    ).length;
    return { ready, total };
  };

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Asset Readiness</h1>
      {Object.keys(groupedAssets).length === 0 ? (
        <p className={`text-center ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>No assets available.</p>
      ) : (
        Object.entries(groupedAssets).map(([date, assets]) => {
          const stats = calculateReadinessStats(assets);
          return (
            <div key={date} className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Onboarding Date: {date}
              </h2>
              <div className="mb-4 text-gray-700 dark:text-gray-300">
                {stats.ready} / {stats.total} Ready
              </div>
              <div className="grid grid-cols-1 gap-4">
                {assets.map((asset) => (
                  <div key={asset.id} className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div>Asset Number: {asset.asset_number}</div>
                        <div>Login ID: {asset.login_id}</div>
                        <div>Business Group: {asset.business_group}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-md ${asset.ynx1c_complete ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                          YNX1C {asset.ynx1c_complete ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                        </div>
                        <div className={`p-2 rounded-md ${asset.rsa_complete ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                          RSA {asset.rsa_complete ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                        </div>
                        <div className={`p-2 rounded-md ${asset.business_bundles_complete ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                          Bundles {asset.business_bundles_complete ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                        </div>
                        <div className={`p-2 rounded-md ${asset.imaging_complete ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                          Imaging {asset.imaging_complete ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AssetReadiness;
