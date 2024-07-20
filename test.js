const mergeData = () => {
  return assets.map(asset => {
    const userInfoData = userInfo[asset.login_id] || {};
    return {
      ...asset,
      ...userInfoData,
    };
  });
};

const handleExportToExcel = () => {
  const dataToExport = mergeData();

  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Assets');
  XLSX.writeFile(wb, 'assets.xlsx');
};
