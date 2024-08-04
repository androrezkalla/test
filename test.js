import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

Chart.register(ArcElement, Tooltip, Legend);

const StatisticsPage = ({ darkMode }) => {
  const [statistics, setStatistics] = useState({
    totalAssets: 0,
    defectiveDevices: 0,
    assetsByTechnician: [],
    ynx1cChecked: 0,
    rsaChecked: 0,
    imagingChecked: 0,
    bundlesChecked: 0,
    assetsReady: 0,
    assetsNotReady: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [assetsResponse, ynx1cResponse, rsaResponse, imagingResponse, bundlesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/assets'),
          axios.get('http://localhost:5000/api/assets?status=YNX1C'),
          axios.get('http://localhost:5000/api/assets?status=RSA'),
          axios.get('http://localhost:5000/api/assets?status=Imaging'),
          axios.get('http://localhost:5000/api/assets?status=Bundles'),
        ]);

        const assetsData = assetsResponse.data;
        const ynx1cData = ynx1cResponse.data.length;
        const rsaData = rsaResponse.data.length;
        const imagingData = imagingResponse.data.length;
        const bundlesData = bundlesResponse.data.length;

        const assetsReady = assetsData.filter(asset => asset.status === 'Ready').length;
        const assetsNotReady = assetsData.length - assetsReady;

        setStatistics({
          totalAssets: assetsData.length,
          defectiveDevices: assetsData.filter(asset => asset.defective).length,
          assetsByTechnician: assetsData.reduce((acc, asset) => {
            acc[asset.technician] = (acc[asset.technician] || 0) + 1;
            return acc;
          }, {}),
          ynx1cChecked: ynx1cData,
          rsaChecked: rsaData,
          imagingChecked: imagingData,
          bundlesChecked: bundlesData,
          assetsReady,
          assetsNotReady,
        });

        setLoading(false);
      } catch (error) {
        setError('Failed to fetch statistics');
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const chartData = {
    labels: ['YNX1C Checked', 'RSA Checked', 'Imaging Checked', 'Bundles Checked'],
    datasets: [
      {
        label: 'Checks',
        data: [statistics.ynx1cChecked, statistics.rsaChecked, statistics.imagingChecked, statistics.bundlesChecked],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  if (loading) {
    return <p className={`text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Loading...</p>;
  }

  if (error) {
    return <p className={`text-center ${darkMode ? 'text-red-500' : 'text-red-700'}`}>{error}</p>;
  }

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Statistics</h1>

      <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Asset Statistics</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>Total Assets: {statistics.totalAssets}</div>
          <div>Defective Devices: {statistics.defectiveDevices}</div>
          <div>YNX1C Checked: {statistics.ynx1cChecked}</div>
          <div>RSA Checked: {statistics.rsaChecked}</div>
          <div>Imaging Checked: {statistics.imagingChecked}</div>
          <div>Bundles Checked: {statistics.bundlesChecked}</div>
          <div>Assets Ready: {statistics.assetsReady}</div>
          <div>Assets Not Ready: {statistics.assetsNotReady}</div>
        </div>
      </div>

      <div className="mb-4 text-right">
        <button
          onClick={() => setLoading(true)}
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 text-gray-100 hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          <FontAwesomeIcon icon={faSync} className="mr-2" />
          Refresh
        </button>
      </div>

      <div className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default StatisticsPage;
