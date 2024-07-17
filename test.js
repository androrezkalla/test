import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faSave, faTimes, faFileExcel, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { Modal, Button } from 'react-bootstrap'; // Assuming you're using Bootstrap modal components

const CentralDatabase = ({ darkMode }) => {
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
      setAssets(data.map(asset => ({
        ...asset,
        showModal: false, // New property to manage modal visibility for each asset
        platformType: '',
        phoneNumber: '',
        imei1: '',
        imei2: '',
      })));
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
    // Implement edit functionality if needed
  };

  const handleSaveEdit = async (assetId) => {
    // Implement save edit functionality if needed
  };

  const handleCancelEdit = () => {
    // Implement cancel edit functionality if needed
  };

  const handleStageUpdate = (assetId, stageType, isChecked) => {
    // Implement stage update functionality if needed
  };

  const calculateStats = () => {
    // Calculate stats logic
  };

  const handleExportToExcel = () => {
    // Handle export to Excel logic
  };

  const handlePhoneIconClick = (assetId) => {
    setAssets(assets.map(asset =>
      asset.id === assetId ? { ...asset, showModal: true } : asset
    ));
  };

  const handleClosePhoneModal = (assetId) => {
    setAssets(assets.map(asset =>
      asset.id === assetId ? { ...asset, showModal: false } : asset
    ));
  };

  const handlePhoneModalSubmit = (assetId) => {
    // Handle phone modal submit logic for the specific asset
    setAssets(assets.map(asset =>
      asset.id === assetId ? {
        ...asset,
        showModal: false,
        platformType: '',
        phoneNumber: '',
        imei1: '',
        imei2: '',
      } : asset
    ));
  };

  const stats = calculateStats();

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
                  <p className={`text-lg ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{asset.asset_number}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Batch Date: {new Date(asset.batch_date).toLocaleDateString()}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Technician: {asset.technician}</p>
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
                  <button
                    onClick={() => handlePhoneIconClick(asset.id)}
                    className={`p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none ${darkMode ? 'dark' : ''}`}
                  >
                    <FontAwesomeIcon icon={faPhoneAlt} />
                  </button>
                  {/* Edit and Delete Buttons */}
                  {/* Replace with your edit and delete button logic */}
                </div>
              </div>
              {/* Phone Modal */}
              <Modal show={asset.showModal} onHide={() => handleClosePhoneModal(asset.id)}>
                <Modal.Header closeButton>
                  <Modal.Title>Phone Details for Asset: {asset.asset_number}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form>
                    <div className="mb-3">
                      <label htmlFor={`platformType_${asset.id}`} className="form-label">Platform Type</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`platformType_${asset.id}`}
                        value={asset.platformType}
                        onChange={(e) => setAssets(assets.map(a =>
                          a.id === asset.id ? { ...a, platformType: e.target.value } : a
                        ))}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`phoneNumber_${asset.id}`} className="form-label">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`phoneNumber_${asset.id}`}
                        value={asset.phoneNumber}
                        onChange={(e) => setAssets(assets.map(a =>
                          a.id === asset.id ? { ...a, phoneNumber: e.target.value } : a
                        ))}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`imei1_${asset.id}`} className="form-label">IMEI1</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`imei1_${asset.id}`}
                        value={asset.imei1}
                        onChange={(e) => setAssets(assets.map(a =>
                          a.id === asset.id ? { ...a, imei1: e.target.value } : a
                        ))}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`imei2_${asset.id}`} className="form-label">IMEI2</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`imei2_${asset.id}`}
                        value={asset.imei2}
                        onChange={(e) => setAssets(assets.map(a =>
                          a.id === asset.id ? { ...a, imei2: e.target.value } : a
                        ))}
                      />
                    </div>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => handleClosePhoneModal(asset.id)}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={() => handlePhoneModalSubmit(asset.id)}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default CentralDatabase;
