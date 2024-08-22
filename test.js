onst [view, setView] = useState('default');

const columns = React.useMemo(() => {
  if (view === 'default') {
    return [
      { Header: 'Employee ID', accessor: 'employee_id' },
      { Header: 'Business Group', accessor: 'business_group' },
      { Header: 'Asset Number', accessor: 'asset_number' },
      { Header: 'Login ID', accessor: 'login_id' },
    ];
  } else if (view === 'detailed') {
    return [
      { Header: 'Employee ID', accessor: 'employee_id' },
      { Header: 'Business Group', accessor: 'business_group' },
      { Header: 'Asset Number', accessor: 'asset_number' },
      { Header: 'Login ID', accessor: 'login_id' },
      { Header: 'First Name', accessor: 'first_name' },
      { Header: 'Last Name', accessor: 'last_name' },
      { Header: 'Preferred Name', accessor: 'preferred_name' },
      { Header: 'Personal Email', accessor: 'personal_email' },
      { Header: 'Phone Number', accessor: 'phone_number' },
      { Header: 'School', accessor: 'school' },
      { Header: 'Business Manager', accessor: 'business_manager' },
      { Header: 'Transit', accessor: 'transit' },
    ];
  }
  return [];
}, [view, filterInput, darkMode]);


return (
  <div className={`container mx-auto p-4 ${darkMode ? 'dark' : ''}`}>
    <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Asset Table</h1>
    <div className="mb-4 text-center">
      <button
        onClick={handleExportToExcel}
        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-green-600 text-gray-100 hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
      >
        <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
      </button>
    </div>
    <div className="mb-4 text-center">
      <select
        value={view}
        onChange={(e) => setView(e.target.value)}
        className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-900'}`}
      >
        <option value="default">Default View</option>
        <option value="detailed">Detailed View</option>
      </select>
    </div>
    <div className="overflow-x-auto">
      <table {...getTableProps()} className="min-w-full bg-white dark:bg-gray-800">
        <thead>