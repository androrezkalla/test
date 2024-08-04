import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const StatisticsPage = ({ darkMode }) => {
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    defectiveDevices: 0,
    assetsReady: 0,
    assetsNotReady: 0,
    imagingComplete: 0,
    ynx1cComplete: 0,
    bundlesComplete: 0,
    rsaComplete: 0,
    assetsByTechnician: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/statistics');
        setStatistics(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const {
    total_assets,
    defective_devices,
    assets_ready,
    assets_not_ready,
    imaging_complete,
    ynx1c_complete,
    bundles_complete,
    rsa_complete,
    assets_by_technician,
  } = statistics;

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Statistics</h1>

      {/* Stats Bar */}
      <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Overview</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>Total Assets: {total_assets}</div>
          <div>Defective Devices: {defective_devices}</div>
          <div>Assets Ready: {assets_ready}</div>
          <div>Assets Not Ready: {assets_not_ready}</div>
          <div>Imaging Complete: {imaging_complete}</div>
          <div>YNX1C Complete: {ynx1c_complete}</div>
          <div>Bundles Complete: {bundles_complete}</div>
          <div>RSA Complete: {rsa_complete}</div>
        </div>
      </div>

      {/* Assets by Technician */}
      <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Assets by Technician</h2>
        {assets_by_technician.length === 0 ? (
          <p className={`text-center ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>No data available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {assets_by_technician.map(({ technician, count }) => (
              <div key={technician} className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
                <div className="flex justify-between items-center">
                  <div>Technician: {technician}</div>
                  <div>Count: {count}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pie Chart Example */}
      {/* You can uncomment and adjust the following section if you want to display pie charts */}
      {/* 
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Status Distribution</h2>
        <Pie
          data={{
            labels: ['Imaging Complete', 'YNX1C Complete', 'Bundles Complete', 'RSA Complete'],
            datasets: [{
              data: [imaging_complete, ynx1c_complete, bundles_complete, rsa_complete],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }]
          }}
        />
      </div> 
      */}
    </div>
  );
};

export default StatisticsPage;
