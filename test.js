const calculateStats = () => {
  const stats = {
    total_assets: assets.length,
    imaging_complete: 0,
    ynx1c_complete: 0,
    business_bundles_complete: 0,
    rsa_complete: 0,
    fully_complete: 0,
    incomplete: 0,
  };

  assets.forEach(asset => {
    if (asset.imaging_complete) stats.imaging_complete++;
    if (asset.ynx1c_complete) stats.ynx1c_complete++;
    if (asset.business_bundles_complete) stats.business_bundles_complete++;
    if (asset.rsa_complete) stats.rsa_complete++;
    if (asset.imaging_complete && asset.ynx1c_complete && asset.business_bundles_complete && asset.rsa_complete) {
      stats.fully_complete++;
    } else {
      stats.incomplete++;
    }
  });

  return stats;
};

const handleExportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(assets);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Assets");
  XLSX.writeFile(wb, "assets.xlsx");
};

const handleFetchUserInfo = async (loginId) => {
  setLoadingUserInfo(loginId);
  try {
    const response = await fetch('http://localhost:5000/api/run-powershell', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        script: `Get-ADUser -Filter {SamAccountName -eq '${loginId}'} -Properties * | Select GivenName,Surname,SamAccountName,EmployeeID,HomeDirectory,SID`
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        [loginId]: formatUserInfo(data.output)
      }));
    } else {
      console.error('Failed to fetch user info:', data.error);
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error);
  } finally {
    setLoadingUserInfo('');
  }
};

const handleFetchAllUserInfo = async () => {
  setLoadingAllUsers(true);
  const userInfoPromises = assets.map(asset => handleFetchUserInfo(asset.login_id));
  await Promise.all(userInfoPromises);
  setLoadingAllUsers(false);
};

const formatUserInfo = (output) => {
  return output
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
};

const stats = calculateStats();

const chartData = {
  labels: ['Imaging Complete', 'YNX1C Complete', 'Business Bundles Complete', 'RSA Complete', 'Fully Complete', 'Incomplete'],
  datasets: [
    {
      label: 'Completion Rate',
      data: [
        stats.imaging_complete,
        stats.ynx1c_complete,
        stats.business_bundles_complete,
        stats.rsa_complete,
        stats.fully_complete,
        stats.incomplete,
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(201, 203, 207, 0.6)',
      ],
    },
  ],
};

return (
  <div className={`container mx-auto p-4 max-w-screen-md ${darkMode ? 'dark' : ''}`}>
    <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Central Database</h1>

    {/* Stats Bar */}
    <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Statistics</h2>
      <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
        <div>Total Assets: {stats.total_assets}</div>
        <div>Fully Complete: {stats.fully_complete}</div>
        <div>Incomplete: {stats.incomplete}</div>
        <div>Imaging Complete: {stats.imaging_complete}</div>
        <div>YNX1C Complete: {stats.ynx1c_complete}</div>
        <div>Business Bundles Complete: {stats.business_bundles_complete}</div>
        <div>RSA Complete: {stats.rsa_complete}</div>
      </div>
    </div>

    {/* Completion Rate Chart */}
    <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Completion Rate</h2>
      <Bar data={chartData} />
    </div>