app.get('/api/statistics', async (req, res) => {
  try {
    const totalAssetsResult = await pool.query('SELECT COUNT(*) FROM assets');
    const totalAssets = parseInt(totalAssetsResult.rows[0].count, 10);

    const defectiveDevicesResult = await pool.query('SELECT COUNT(*) FROM defective_devices');
    const defectiveDevices = parseInt(defectiveDevicesResult.rows[0].count, 10);

    const assetsByTechnicianResult = await pool.query('SELECT technician, COUNT(*) FROM assets GROUP BY technician');
    const assetsByTechnician = assetsByTechnicianResult.rows.map(row => ({
      technician: row.technician,
      count: parseInt(row.count, 10),
    }));

    const imagingCompleteResult = await pool.query('SELECT COUNT(*) FROM assets WHERE imaging_complete = true');
    const imagingComplete = parseInt(imagingCompleteResult.rows[0].count, 10);

    const ynx1cCompleteResult = await pool.query('SELECT COUNT(*) FROM assets WHERE ynx1c_complete = true');
    const ynx1cComplete = parseInt(ynx1cCompleteResult.rows[0].count, 10);

    const bundlesCompleteResult = await pool.query('SELECT COUNT(*) FROM assets WHERE business_bundles_complete = true');
    const bundlesComplete = parseInt(bundlesCompleteResult.rows[0].count, 10);

    const rsaCompleteResult = await pool.query('SELECT COUNT(*) FROM assets WHERE rsa_complete = true');
    const rsaComplete = parseInt(rsaCompleteResult.rows[0].count, 10);

    res.json({
      total_assets: totalAssets,
      defective_devices: defectiveDevices,
      assets_by_technician: assetsByTechnician,
      imaging_complete: imagingComplete,
      ynx1c_complete: ynx1cComplete,
      bundles_complete: bundlesComplete,
      rsa_complete: rsaComplete,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const StatisticsPage = ({ darkMode }) => {
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    defectiveDevices: 0,
    assetsByTechnician: [],
    imagingComplete: 0,
    ynx1cComplete: 0,
    bundlesComplete: 0,
    rsaComplete: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/statistics');
        setStatistics(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const {
    total_assets,
    defective_devices,
    assets_by_technician,
    imaging_complete,
    ynx1c_complete,
    bundles_complete,
    rsa_complete,
  } = statistics;

  const data = {
    labels: ['Imaging Complete', 'YNX1C Complete', 'Bundles Complete', 'RSA Complete'],
    datasets: [
      {
        data: [imaging_complete, ynx1c_complete, bundles_complete, rsa_complete],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Statistics Page</h1>

      {/* Stats Bar */}
      <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Statistics</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>Total Assets: {total_assets}</div>
          <div>Defective Devices: {defective_devices}</div>
          <div>Imaging Complete: {imaging_complete}</div>
          <div>YNX1C Complete: {ynx1c_complete}</div>
          <div>Business Bundles Complete: {bundles_complete}</div>
          <div>RSA Complete: {rsa_complete}</div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="mb-4">
        <Pie data={data} />
      </div>

      {/* Assets by Technician */}
      <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Assets by Technician</h2>
        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
          {assets_by_technician.map((item, index) => (
            <li key={index}>
              {item.technician}: {item.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StatisticsPage;
