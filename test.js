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
    ynx1cChecked: 0,
    rsaChecked: 0,
    imagingChecked: 0,
    bundlesChecked: 0,
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

        const totalAssets = assetsResponse.data.length;
        const defectiveDevices = assetsResponse.data.filter(asset => asset.defective).length;
        const assetsByTechnician = assetsResponse.data.reduce((acc, asset) => {
          acc[asset.technician] = (acc[asset.technician] || 0) + 1;
          return acc;
        }, {});

        const ynx1cChecked = ynx1cResponse.data.length;
        const rsaChecked = rsaResponse.data.length;
        const imagingChecked = imagingResponse.data.length;
        const bundlesChecked = bundlesResponse.data.length;

        setStatistics({
          totalAssets,
          defectiveDevices,
          assetsByTechnician,
          ynx1cChecked,
          rsaChecked,
          imagingChecked,
          bundlesChecked,
        });

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading statistics: {error.message}</div>;

  const chartData = {
    labels: ['YNX1C Checked', 'RSA Checked', 'Imaging Checked', 'Bundles Checked'],
    datasets: [
      {
        data: [statistics.ynx1cChecked, statistics.rsaChecked, statistics.imagingChecked, statistics.bundlesChecked],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className={`statistics-page ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Statistics</h1>
      <div className="stat-item">
        <strong>Total Assets:</strong> {statistics.totalAssets}
      </div>
      <div className="stat-item">
        <strong>Defective Devices:</strong> {statistics.defectiveDevices}
      </div>
      <div className="stat-item">
        <strong>Assets by Technician:</strong>
        <ul>
          {Object.entries(statistics.assetsByTechnician).map(([technician, count]) => (
            <li key={technician}>
              {technician}: {count}
            </li>
          ))}
        </ul>
      </div>
      <div className="chart-container" style={{ height: '400px', width: '400px' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StatisticsPage;
