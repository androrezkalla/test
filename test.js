<div className="mb-4 text-center">
  <label htmlFor="view-selector" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select View:</label>
  <select
    id="view-selector"
    value={view}
    onChange={(e) => setView(e.target.value)}
    className={`block w-1/2 mx-auto px-4 py-2 mt-2 rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'}`}
  >
    <option value="default">Default View</option>
    <option value="detailed">Detailed View</option>
  </select>
</div>
