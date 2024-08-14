import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';

const QrCodeGenerator = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);

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

  const generateQrValue = (asset) => {
    const { asset_number, login_id, first_name, last_name } = asset;
    return `Asset Number: ${asset_number}, Login ID: ${login_id}, First Name: ${first_name}, Last Name: ${last_name}`;
  };

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
      {assets.map((asset) => (
        <div
          key={asset.asset_number}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow mb-4"
        >
          <p><strong>Asset Number:</strong> {asset.asset_number}</p>
          <p><strong>Login ID:</strong> {asset.login_id}</p>
          <p><strong>First Name:</strong> {asset.first_name}</p>
          <p><strong>Last Name:</strong> {asset.last_name}</p>
          <QRCode
            value={generateQrValue(asset)}
            size={128}
            bgColor={darkMode ? '#333' : '#fff'}
            fgColor={darkMode ? '#fff' : '#000'}
            includeMargin={true}
          />
        </div>
      ))}
    </div>
  );
};

export default QrCodeGenerator;
