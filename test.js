import React, { useEffect, useState } from 'react';
import { useTable, useFilters, useSortBy } from 'react-table';
import * as XLSX from 'xlsx';

const AssetTable = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [editableRowId, setEditableRowId] = useState(null);
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

  const handleChange = (e, assetId, field) => {
    setEditValues((prev) => ({
      ...prev,
      [assetId]: {
        ...prev[assetId],
        [field]: e.target.value
      }
    }));
  };

  const handleBlur = async (assetId) => {
    try {
      const asset = editValues[assetId];
      const response = await fetch(`http://localhost:5000/api/assets/${assetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asset),
      });
      if (!response.ok) {
        throw new Error('Failed to save asset');
      }
      const updatedAsset = await response.json();
      setAssets(assets.map((item) => (item.id === assetId ? updatedAsset : item)));
      setEditableRowId(null);
      setEditValues((prev) => ({ ...prev, [assetId]: undefined }));
    } catch (error) {
      console.error('Failed to save asset:', error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Asset Number',
        accessor: 'asset_number',
        Cell: ({ row }) => (
          <input
            type="text"
            value={editValues[row.original.id]?.asset_number || row.original.asset_number}
            onChange={(e) => handleChange(e, row.original.id, 'asset_number')}
            onBlur={() => handleBlur(row.original.id)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
            readOnly={editableRowId !== row.original.id && editableRowId !== null}
            onClick={() => setEditableRowId(row.original.id)}
          />
        )
      },
      {
        Header: 'Login ID',
        accessor: 'login_id',
        Cell: ({ row }) => (
          <input
            type="text"
            value={editValues[row.original.id]?.login_id || row.original.login_id}
            onChange={(e) => handleChange(e, row.original.id, 'login_id')}
            onBlur={() => handleBlur(row.original.id)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
            readOnly={editableRowId !== row.original.id && editableRowId !== null}
            onClick={() => setEditableRowId(row.original.id)}
          />
        )
      },
      {
        Header: 'Business Group',
        accessor: 'business_group',
        Cell: ({ row }) => (
          <input
            type="text"
            value={editValues[row.original.id]?.business_group || row.original.business_group}
            onChange={(e) => handleChange(e, row.original.id, 'business_group')}
            onBlur={() => handleBlur(row.original.id)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
            readOnly={editableRowId !== row.original.id && editableRowId !== null}
            onClick={() => setEditableRowId(row.original.id)}
          />
        )
      },
      {
        Header: 'Employee ID',
        accessor: 'employee_id',
        Cell: ({ row }) => (
          <input
            type="text"
            value={editValues[row.original.id]?.employee_id || row.original.employee_id}
            onChange={(e) => handleChange(e, row.original.id, 'employee_id')}
            onBlur={() => handleBlur(row.original.id)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
            readOnly={editableRowId !== row.original.id && editableRowId !== null}
            onClick={() => setEditableRowId(row.original.id)}
          />
        )
      },
    ],
    [editValues, editableRowId, darkMode]
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

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(assets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Assets");
    XLSX.writeFile(wb, "assets.xlsx");
  };

  return (
    <div className={`container mx-auto p-4 ${darkMode ? 'dark' : ''}`}>
      <div className="flex justify-end mb-4">
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
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssetTable;
