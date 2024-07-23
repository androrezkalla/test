import React, { useEffect, useState } from 'react';
import { useTable, useFilters, useSortBy } from 'react-table';
import * as XLSX from 'xlsx';

const AssetTable = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [editAssetId, setEditAssetId] = useState(null);
  const [editValues, setEditValues] = useState({});

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
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  const handleRowClick = (asset) => {
    if (editAssetId === asset.id) {
      setEditAssetId(null); // Exit edit mode if clicked again
    } else {
      setEditAssetId(asset.id);
      setEditValues({
        asset_number: asset.asset_number,
        login_id: asset.login_id,
        business_group: asset.business_group,
        employee_id: asset.employee_id
      });
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${editAssetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editValues),
      });
      if (!response.ok) {
        throw new Error('Failed to save asset');
      }
      const updatedAsset = await response.json();
      setAssets(assets.map((asset) => (asset.id === editAssetId ? updatedAsset : asset)));
      setEditAssetId(null);
      setEditValues({});
    } catch (error) {
      console.error('Failed to save asset:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: value
    });
  };

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(assets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    XLSX.writeFile(wb, "assets.xlsx");
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Asset Number',
        accessor: 'asset_number',
      },
      {
        Header: 'Login ID',
        accessor: 'login_id',
      },
      {
        Header: 'Business Group',
        accessor: 'business_group',
      },
      {
        Header: 'Employee ID',
        accessor: 'employee_id',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: assets,
    },
    useFilters,
    useSortBy
  );

  return (
    <div className={`container mx-auto p-4 ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Asset Table</h1>

      <div className="mb-4 text-right">
        <button
          onClick={handleExportToExcel}
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-green-600 text-gray-100 hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
        >
          Export to Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 border-b border-gray-200 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  onClick={() => handleRowClick(row.original)}
                  className={`cursor-pointer ${editAssetId === row.original.id ? 'bg-yellow-100 dark:bg-yellow-800' : ''}`}
                >
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      {editAssetId === row.original.id ? (
                        <input
                          type="text"
                          name={cell.column.id}
                          value={editValues[cell.column.id]}
                          onChange={handleChange}
                          className={`w-full px-2 py-1 border rounded-md shadow-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
                        />
                      ) : (
                        cell.render('Cell')
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editAssetId && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveClick}
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-green-600 text-gray-100 hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
          >
            Save
          </button>
          <button
            onClick={() => setEditAssetId(null)}
            className={`ml-4 px-4 py-2 rounded-md ${darkMode ? 'bg-red-600 text-gray-100 hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AssetTable;
