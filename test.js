const handleEditAsset = (assetId, assetNumber, loginId, businessGroup) => {
  setEditAssetId(assetId);
  setEditAssetNumber(assetNumber);  // Set to the current asset number
  setEditLoginId(loginId);          // Set to the current login ID
  setEditBusinessGroup(businessGroup);  // Set to the current business group
};

// In the component render method
{assets.map((asset) => (
  <div key={asset.id} className={`p-4 border rounded-md ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}`}>
    <div className="flex justify-between items-center">
      <div>
        {editAssetId === asset.id ? (
          <>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Asset Number
              <input
                type="text"
                value={editAssetNumber}
                onChange={(e) => setEditAssetNumber(e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
              Login ID
              <input
                type="text"
                value={editLoginId}
                onChange={(e) => setEditLoginId(e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
              Business Group
              <input
                type="text"
                value={editBusinessGroup}
                onChange={(e) => setEditBusinessGroup(e.target.value)}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
              />
            </label>
          </>
        ) : (
          <>
            <p className={`text-lg ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{asset.asset_number}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Login ID: {asset.login_id}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Business Group: {asset.business_group}</p>
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
              onClick={() => handleEditAsset(asset.id, asset.asset_number, asset.login_id, asset.business_group)}
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
