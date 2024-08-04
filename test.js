const stats = calculateStats();

  const getBackgroundColor = (asset) => {
    const completedTasks = ['imaging_complete', 'ynx1c_complete', 'business_bundles_complete', 'rsa_complete'].filter(task => asset[task]).length;
    if (completedTasks === 2) {
      return darkMode ? 'bg-orange-600' : 'bg-orange-500';
    } else if (completedTasks === 4) {
      return darkMode ? 'bg-green-600' : 'bg-green-500';
    } else {
      return darkMode ? 'bg-gray-800' : 'bg-white';
    }
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
          <div>Business Bundles Complete: {stats.business_bundles_complete}</div>
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
        <button
          onClick={handleFetchAllUserInfo}
          className={`ml-4 px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 text-gray-100 hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          disabled={loadingAllUsers}
        >
          <FontAwesomeIcon icon={faSync} className="mr-2" />
          {loadingAllUsers ? 'Fetching...' : 'Fetch All User Info'}
        </button>
      </div>

      {assets.length === 0 ? (
        <p className={`text-center ${darkMode ? 'text-gray-600' : 'text-gray-300'}`}>No assets available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={`p-4 border rounded-md ${getBackgroundColor(asset)} ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  {editAssetId === asset.id ? (
                    <>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Number</label>
                      <input
                        type="text"
                        value={editAssetNumber}
                        onChange={(e) => setEditAssetNumber(e.target.value)}
                        className={`w-full p-2 mt-1 mb-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                      />