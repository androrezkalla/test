import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { BrotherLabelPrinter } from 'node-ptouch';

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

    const qrData = [];
    if (asset_number) qrData.push(`Asset Number: ${asset_number}`);
    if (login_id) qrData.push(`Login ID: ${login_id}`);
    if (first_name) qrData.push(`First Name: ${first_name}`);
    if (last_name) qrData.push(`Last Name: ${last_name}`);

    return qrData.join(', ');
  };

  const printLabel = async (asset) => {
    const printer = new BrotherLabelPrinter('your-printer-ip');
    
    const qrValue = generateQrValue(asset);

    await printer.print({
      text: `${asset.first_name} ${asset.last_name}`,
      qrCode: qrValue,
      options: {
        qrSize: 128,
      },
    });
  };

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
      {assets.map((asset) => (
        <div
          key={asset.asset_number}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow mb-4 flex justify-between"
        >
          <div>
            <p><strong>Asset Number:</strong> {asset.asset_number || 'N/A'}</p>
            <p><strong>Login ID:</strong> {asset.login_id || 'N/A'}</p>
            <p><strong>First Name:</strong> {asset.first_name || 'N/A'}</p>
            <p><strong>Last Name:</strong> {asset.last_name || 'N/A'}</p>
          </div>
          <div className="flex items-center">
            <QRCode
              value={generateQrValue(asset)}
              size={128}
              bgColor={darkMode ? '#333' : '#fff'}
              fgColor={darkMode ? '#fff' : '#000'}
              includeMargin={true}
            />
          </div>
          <button onClick={() => printLabel(asset)} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded">
            Print Label
          </button>
        </div>
      ))}
    </div>
  );
};

export default QrCodeGenerator;
