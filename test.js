
import { faTrashAlt, faEdit, faSave, faTimes, faFileExcel, faUser, faSync, faThList, faThLarge } from '@fortawesome/free-solid-svg-icons';

  const [viewMode, setViewMode] = useState('list');

  


  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'list' ? 'grid' : 'list'));
  };

  
  return (
    <div className={`container mx-auto p-4 ${viewMode === 'list' ? 'max-w-screen-md' : 'max-w-screen-lg'} ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Central Database</h1>

      {/* Stats Bar */}
      <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Statistics</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div>Total Assets: {stats.total_assets}</div>
          <div>Imaging Complete: {stats.imaging_complete}</div>
          <div>YNX1C Complete: {stats.ynx1c_complete}</div>
          <div>Business Bundles Complete: {stats.business_bundles_complete}</div>
          <div>RSA Complete: {stats.rsa_complete}</div>
          <div>Fully Complete: {stats.fully_complete}</div>
        </div>
        <div className="w-full h-64 mt-4">
          <Pie data={pieData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Export to Excel and Toggle View Buttons */}
      <div className="mb-4 text-right">
        <button
          onClick={handleExportToExcel}
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-green-600 text-gray-100 hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
        >
          <FontAwesomeIcon icon={faFileExcel} className="mr-2" />Export to Excel
        </button>
        <button
          onClick={handleFetchAllUserInfo}
          className={`ml-4 px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 text-gray-100 hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          disabled={loadingAllUsers}
        >
          <FontAwesomeIcon icon={faSync} className="mr-2" />
          {loadingAllUsers ? 'Fetching...' : 'Fetch All User Info'}
        </button>
        <button
          onClick={toggleViewMode}
          className={`ml-4 px-4 py-2 rounded-md ${darkMode ? 'bg-yellow-600 text-gray-100 hover:bg-yellow-700' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
        >
          <FontAwesomeIcon icon={viewMode === 'list' ? faThLarge : faThList} className="mr-2" />
          {viewMode === 'list' ? 'Grid View' : 'List View'}
        </button>
      </div>

      {assets.length === 0 ? (
        <p className={`text-center ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>No assets available.</p>
      ) : (
        <div className={`grid ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
          {assets.map((asset) => (
            <div key={asset.id} className="border p-4 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600">
              {editAssetId === asset.id ? (
                <>
                  <input
                    type="text"
                    value={editAssetNumber}
                    onChange={(e) => setEditAssetNumber(e.target.value)}
                    className="mb-2 p-2 border rounded-md w-full"
                  />
                  <input
                    type="text"
                    value={editLoginId}
                    onChange={(e) => setEditLoginId(e.target.value)}
                    className="mb-2 p-2 border rounded-md w-full"
                  />
                  <input
                    type="text"
                    value={editBusinessGroup}
                    onChange={(e) => setEditBusinessGroup(e.target.value)}
                    className="mb-2 p-2 border rounded-md w-full"
                  />
                  <button
                    onClick={() => handleSaveEdit(asset.id)}
                    className="mr-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <FontAwesomeIcon icon={faSave} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </>
              ) 