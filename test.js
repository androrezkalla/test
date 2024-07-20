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
  const [assetDetails, setAssetDetails] = useState({});

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
      setAssetDetails({ ...assetDetails, ...newAssets.reduce((acc, asset) => ({ ...acc, [asset]: { loginId: '', businessGroup: '' } }), {}) });
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
    const batchData = {
      batchDate,
      technician,
      assets: assets.map(asset => ({
        asset_number: asset,
        login_id: assetDetails[asset]?.loginId || '',
        business_group: assetDetails[asset]?.businessGroup || ''
      })),
    };

    console.log("Submitting Batch Data:", batchData);

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
                <div className="flex space-x-2 ml-4">
                  <input
                    type="text"
                    className="px-2 py-1 border rounded-md w-40"
                    placeholder="Login ID"
                    value={assetDetails[asset]?.loginId || ''}
                    onChange={(e) => setAssetDetails({
                      ...assetDetails,
                      [asset]: { ...assetDetails[asset], loginId: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    className="px-2 py-1 border rounded-md w-40"
                    placeholder="Business Group"
                    value={assetDetails[asset]?.businessGroup || ''}
                    onChange={(e) => setAssetDetails({
                      ...assetDetails,
                      [asset]: { ...assetDetails[asset], businessGroup: e.target.value }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAsset(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className={`mt-4 px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Submit Batch
        </button>
      </form>

      {/* Modal for Adding/Editing Technicians */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className={`bg-white p-4 rounded-md shadow-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-900'}`}>
            <h2 className="text-xl font-bold mb-4">{modalType === 'add' ? 'Add Technician' : 'Edit Technician'}</h2>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              placeholder="Technician Name"
            />
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalSubmit}
                className={`ml-2 px-4 py-2 rounded-md ${modalType === 'add' ? (darkMode ? 'bg-green-600 text-gray-300 hover:bg-green-500' : 'bg-green-500 text-white hover:bg-green-600') : (darkMode ? 'bg-yellow-600 text-gray-300 hover:bg-yellow-500' : 'bg-yellow-500 text-white hover:bg-yellow-600')}`}
              >
                {modalType === 'add' ? 'Add' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Batch;
