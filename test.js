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
        
        <div className="grid grid-cols-1 gap-4 text-gray-700 dark:text-gray-300">
          <div className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
            <h3 className="text-lg font-semibold">Total Assets</h3>
            <p>{total_assets}</p>
          </div>
          
          <div className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
            <h3 className="text-lg font-semibold">Defective Devices</h3>
            <p>{defective_devices}</p>
          </div>
          
          <div className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
            <h3 className="text-lg font-semibold">Imaging Complete</h3>
            <p>{imaging_complete}</p>
          </div>
          
          <div className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
            <h3 className="text-lg font-semibold">YNX1C Complete</h3>
            <p>{ynx1c_complete}</p>
          </div>
          
          <div className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
            <h3 className="text-lg font-semibold">Business Bundles Complete</h3>
            <p>{bundles_complete}</p>
          </div>
          
          <div className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
            <h3 className="text-lg font-semibold">RSA Complete</h3>
            <p>{rsa_complete}</p>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Distribution</h2>
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
