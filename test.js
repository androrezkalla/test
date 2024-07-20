import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

const Batch = ({ darkMode }) => {
  const navigate = useNavigate();

  const [batchDate, setBatchDate] = useState('');
  const [technician, setTechnician] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [assets, setAssets] = useState([]);
  const [newAssetsInput, setNewAssetsInput] = useState('');
  const [assetDetails, setAssetDetails] = useState({}); // Store login ID and business group details

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentTechnicianId, setCurrentTechnicianId] = useState(null);
  const [technicianName, setTechnicianName] = useState('');

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/technicians');
        setTechnicians(response.data);
      } catch (error) {
        console.error('Error fetching technicians:', error);
      }
    };

    fetchTechnicians();
  }, []);

  const handleAddAssets = () => {
    const newAssets = newAssetsInput.split(' ').filter(asset => asset.trim() !== '');
    if (newAssets.length > 0) {
      setAssets([...assets, ...newAssets]);
      setNewAssetsInput('');
      setAssetDetails(prevDetails => ({
        ...prevDetails,
        ...newAssets.reduce((acc, asset) => ({ ...acc, [asset]: { loginId: '', businessGroup: '' } }), {})
      }));
    }
  };

  const handleRemoveAsset = (index) => {
    const updatedAssets = assets.filter((_, i) => i !== index);
    const updatedAssetDetails = { ...assetDetails };
    delete updatedAssetDetails[assets[index]];
    setAssets(updatedAssets);
    setAssetDetails(updatedAssetDetails);
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();

    // Log the assetDetails to verify it contains the correct data
    console.log('Asset Details:', assetDetails);

    const batchData = {
      batchDate,
      technician,
      assets: assets.map(asset => ({
        asset_number: asset,
        login_id: assetDetails[asset]?.loginId || '',
        business_group: assetDetails[asset]?.businessGroup || '' // Ensure this matches the API expectation
      })),
    };

    // Log the batchData to verify it's being set correctly
    console.log('Batch Data:', batchData);

    try {
      const response = await axios.post('http://localhost:5000/api/assets', batchData);
      if (response.status === 200) {
        navigate('/viewbatch');
      } else {
        console.error('Failed to submit batch:', response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openModal = (type, tech = {}) => {
    setModalType(type);
    setCurrentTechnicianId(tech.id || null);
    setTechnicianName(tech.name || '');
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    try {
      if (modalType === 'add') {
        const response = await axios.post('http://localhost:5000/api/technicians', { name: technicianName });
        setTechnicians([...technicians, response.data]);
        setTechnician(response.data.name);
      } else if (modalType === 'edit') {
        const response = await axios.put(`http://localhost:5000/api/technicians/${currentTechnicianId}`, { name: technicianName });
        setTechnicians(technicians.map(tech => (tech.id === currentTechnicianId ? response.data : tech)));
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving technician:', error);
    }
  };

  const handleDeleteTechnician = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/technicians/${id}`);
      setTechnicians(technicians.filter(tech => tech.id !== id));
      setTechnician('');
    } catch (error) {
      console.error('Error deleting technician:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAssets();
    }
  };

  return (
    <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 mt-20 text-center text-gray-900 dark:text-gray-100">Batch Asset Management</h1>
      <form onSubmit={handleBatchSubmit} className="space-y-4">
        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch Date</label>
          <input
            type="date"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
            value={batchDate}
            onChange={(e) => setBatchDate(e.target.value)}
            required
          />
        </div>

        {/* Technician Input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technician</label>
          <div className="relative">
            <select
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              required
            >
              <option value="">Select Technician</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.name}>{tech.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => openModal('add')}
              className="absolute inset-y-0 right-0 pr-3 text-green-500 hover:text-green-700"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            {technician && (
              <>
                <button
                  type="button"
                  onClick={() => openModal('edit', technicians.find(tech => tech.name === technician))}
                  className="absolute inset-y-0 right-10 pr-3 text-yellow-500 hover:text-yellow-700"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTechnician(technicians.find(tech => tech.name === technician)?.id)}
                  className="absolute inset-y-0 right-20 pr-3 text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Assets Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assets</label>
          <div className="flex space-x-2">
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
              placeholder="Enter asset numbers separated by space"
              value={newAssetsInput}
              onChange={(e) => setNewAssetsInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              onClick={handleAddAssets}
              className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              Add
            </button>
          </div>
          <ul className={`mt-1 border rounded-md divide-y ${darkMode ? 'border-gray-600 divide-gray-600' : 'border-gray-300 divide-gray-300'}`}>
            {assets.map((asset, index) => (
              <li key={index} className={`flex items-center px-3 py-2 border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                <span className={`w-32 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{asset}</span>
                <div className="ml-auto flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveAsset(index)}
                    className={`text-red-500 hover:text-red-700 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Asset Details */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Details</label>
          {assets.map((asset, index) => (
            <div key={index} className="border p-4 mb-2 rounded-md bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Asset: {asset}</h3>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Login ID</label>
                <input
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder="Login ID"
                  value={assetDetails[asset]?.loginId || ''}
                  onChange={(e) => setAssetDetails(prevDetails => ({
                    ...prevDetails,
                    [asset]: { ...prevDetails[asset], loginId: e.target.value }
                  }))}
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Group</label>
                <input
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
                  placeholder="Business Group"
                  value={assetDetails[asset]?.businessGroup || ''}
                  onChange={(e) => setAssetDetails(prevDetails => ({
                    ...prevDetails,
                    [asset]: { ...prevDetails[asset], businessGroup: e.target.value }
                  }))}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Submit Batch
          </button>
        </div>
      </form>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className={`bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg ${darkMode ? 'border border-gray-600' : 'border border-gray-300'}`}>
            <h2 className="text-xl font-bold mb-4">{modalType === 'add' ? 'Add Technician' : 'Edit Technician'}</h2>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Technician Name</label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              required
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 text-gray-300 hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                {modalType === 'add' ? 'Add Technician' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Batch;
