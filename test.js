import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faSave, faTimes, faFileExcel, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { Modal, Button } from 'react-bootstrap'; // Assuming you're using Bootstrap modal components

const CentralDatabase = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [editAssetId, setEditAssetId] = useState(null);
  const [editAssetNumber, setEditAssetNumber] = useState('');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [platformType, setPlatformType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [imei1, setImei1] = useState('');
  const [imei2, setImei2] = useState('');

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

  const handleDeleteAsset = async (assetId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${assetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }
      setAssets(assets.filter((asset) => asset.id !== assetId));
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const handleEditAsset = (assetId, assetNumber) => {
    setEditAssetId(assetId);
    setEditAssetNumber(assetNumber);
  };

  const handleSaveEdit = async (assetId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${assetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ asset_number: editAssetNumber }),
      });
      if (!response.ok) {
        throw new Error('Failed to save asset');
      }
      const updatedAsset = await response.json();
      setAssets(assets.map((asset) => (asset.id === assetId ? updatedAsset : asset)));
      setEditAssetId(null);
      setEditAssetNumber('');
    } catch (error) {
      console.error('Failed to edit asset:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditAssetId(null);
    setEditAssetNumber('');
  };

  const calculateStats = () => {
    const stats = {
      total_assets: assets.length,
      imaging_complete: 0,
      ynx1c_complete: 0,
      business_bundles_complete: 0,
      rsa_complete: 0,
    };

    assets.forEach(asset => {
      if (asset.imaging_complete) stats.imaging_complete++;
      if (asset.ynx1c_complete) stats.ynx1c_complete++;
      if (asset.business_bundles_complete) stats.business_bundles_complete++;
      if (asset.rsa_complete) stats.rsa_complete++;
    });

    return stats;
  };

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(assets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    XLSX.writeFile(wb, "assets.xlsx");
  };

  const stats = calculateStats();

  const handlePhoneIconClick = () => {
    setShowPhoneModal(true);
  };

  const handleClosePhoneModal = () => {
    setShowPhoneModal(false);
  };

  const handlePhoneModalSubmit = () => {
    // Implement logic to handle submission of phone details
    // You can fetch or submit the phone details here
    // Reset form fields and close modal
    setShowPhoneModal(false);
    setPlatformType('');
    setPhoneNumber('');
    setImei1('');
    setImei2('');
  };

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Central Database</h1>

      {/* Stats Bar */}
      <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Statistics</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>Total Assets: {stats.total_assets}</div>
          <div>Imaging Complete: {stats.imaging_complete}</div>
          <div>YNX1C Complete: {stats.ynx1c_complete}</div>
          <div>RSA Complete: {stats.rsa_complete}</div>
        </div>
      </div>

      {/* Export to Excel Button */}
      <div className="mb-4 text-right">
        <button
          onClick={handleExportToExcel}
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-green-600 text-gray-100 hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
        >
          <FontAwesomeIcon icon={faFileExcel} className="mr-2" />Export to Excel
        </button>
      </div>

      {assets.length === 0 ? (
        <p className={`text-center ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>No assets available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
              <div className="flex justify-between items-center">
                <div>
                  {editAssetId === asset.id ? (
                    <>
                      <input
                        type="text"
                        value={editAssetNumber}
                        onChange={(e) => setEditAssetNumber(e.target.value)}
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
                      />
                    </>
                  ) : (
                    <>
                      <p className={`text-lg ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{asset.asset_number}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Batch Date: {new Date(asset.batch_date).toLocaleDateString()}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Technician: {asset.technician}</p>
                    </>
                  )}
                  {/* Stage Checkboxes */}
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={asset.imaging_complete}
                        onChange={(e) => handleStageUpdate(asset.id, 'imaging_complete', e.target.checked)}
                        className="mr-2"
                      />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Imaging</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={asset.ynx1c_complete}
                        onChange={(e) => handleStageUpdate(asset.id, 'ynx1c_complete', e.target.checked)}
                        className="mr-2"
                      />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>YNX1C</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={asset.business_bundles_complete}
                        onChange={(e) => handleStageUpdate(asset.id, 'business_bundles_complete', e.target.checked)}
                        className="mr-2"
                      />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Business Bundles</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={asset.rsa_complete}
                        onChange={(e) => handleStageUpdate(asset.id, 'rsa_complete', e.target.checked)}
                        className="mr-2"
                      />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>RSA</span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {editAssetId === asset.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(asset.id)}
                        className={`px-2 py-1 rounded-md ${darkMode ? 'bg-green-600 text-gray-100 hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-600 text-gray-100 hover:bg-gray-700' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditAsset(asset.id, asset.asset_number)}
                        className={`px-2 py-1 rounded-md ${darkMode ? 'bg-blue-600 text-gray-100 hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className={`px-2 py-1 rounded-md ${darkMode ? 'bg-red-600 text-gray-100 hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phone Icon */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handlePhoneIconClick}
          className={`p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none ${darkMode ? 'dark' : ''}`}
        >
          <FontAwesomeIcon icon={faPhoneAlt} />
        </button>
      </div>

      {/* Phone Modal */}
      <Modal show={showPhoneModal} onHide={handleClosePhoneModal}>
        <Modal.Header closeButton>
          <Modal.Title>Phone Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="platformType" className="form-label">Platform Type</label>
              <input
                type="text"
                className="form-control"
                id="platformType"
                value={platformType}
                onChange={(e) => setPlatformType(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="imei1" className="form-label">IMEI1</label>
              <input
                type="text"
                className="form-control"
                id="imei1"
                value={imei1}
                onChange={(e) => setImei1(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="imei2" className="form-label">IMEI2</label>
              <input
                type="text"
                className="form-control"
                id="imei2"
                value={imei2}
                onChange={(e) => setImei2(e.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePhoneModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePhoneModalSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CentralDatabase;
