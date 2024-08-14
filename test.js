import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

    // Create an array to hold the non-null values
    const qrData = [];
    if (asset_number) qrData.push(`Asset Number: ${asset_number}`);
    if (login_id) qrData.push(`Login ID: ${login_id}`);
    if (first_name) qrData.push(`First Name: ${first_name}`);
    if (last_name) qrData.push(`Last Name: ${last_name}`);

    // Join the values into a single string
    return qrData.join(', ');
  };

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      
      // Create a div element to capture as a PDF page
      const cardElement = document.createElement('div');
      cardElement.innerHTML = `
        <div style="background-color: ${darkMode ? '#333' : '#fff'}; color: ${darkMode ? '#fff' : '#000'}; padding: 20px; border-radius: 10px; margin: 10px; border: 1px solid ${darkMode ? '#555' : '#ccc'};">
          <p><strong>Asset Number:</strong> ${asset.asset_number || 'N/A'}</p>
          <p><strong>Login ID:</strong> ${asset.login_id || 'N/A'}</p>
          <p><strong>First Name:</strong> ${asset.first_name || 'N/A'}</p>
          <p><strong>Last Name:</strong> ${asset.last_name || 'N/A'}</p>
          <img src="${QRCode.toDataURL(generateQrValue(asset))}" style="width: 128px; height: 128px;"/>
        </div>
      `;

      // Append the element to the body for rendering
      document.body.appendChild(cardElement);

      // Capture the div as a canvas
      const canvas = await html2canvas(cardElement);
      const imgData = canvas.toDataURL('image/png');
      
      // Add the image to the PDF
      doc.addImage(imgData, 'PNG', 10, 10, 180, 0);
      
      // Add a new page if there are more assets
      if (i < assets.length - 1) {
        doc.addPage();
      }

      // Remove the element after capturing
      document.body.removeChild(cardElement);
    }

    // Save the PDF
    doc.save('assets-cards.pdf');
  };

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
      <button
        onClick={handleDownloadPDF}
        className={`mb-4 px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 text-gray-100 hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
      >
        Download PDF
      </button>

      {assets.map((asset) => (
        <div
          key={asset.asset_number}
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow mb-4"
        >
          <p><strong>Asset Number:</strong> {asset.asset_number || 'N/A'}</p>
          <p><strong>Login ID:</strong> {asset.login_id || 'N/A'}</p>
          <p><strong>First Name:</strong> {asset.first_name || 'N/A'}</p>
          <p><strong>Last Name:</strong> {asset.last_name || 'N/A'}</p>
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
