import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faEdit, faTrashAlt, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { useTable, useFilters, useSortBy } from 'react-table';
import * as XLSX from 'xlsx';

const AssetTable = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [editMode, setEditMode] = useState(false);
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

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(assets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Assets');
    XLSX.writeFile(wb, 'assets.xlsx');
  };

  const handleEditAll = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: value
    });
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${editValues.id}`, {
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
      setAssets(assets.map((asset) => (asset.id === updatedValues.id ? updatedAsset : asset)));
      setEditMode(false);
      setEditValues({});
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
          editMode ? (
            <input
              type="text"
              name="asset_number"
              value={editValues.asset_number || row.original.asset_number}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
            />
          ) : (
            row.original.asset_number
          )
        )
      },
      {
        Header: 'Login ID',
        accessor: 'login_id',
        Cell: ({ row }) => (
          editMode ? (
            <input
              type="text"
              name="login_id"
              value={editValues.login_id || row.original.login_id}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
            />
          ) : (
            row.original.login_id
          )
        )
      },
      {
        Header: 'Business Group',
        accessor: 'business_group',
        Cell: ({ row }) => (
          editMode ? (
            <input
              type="text"
              name="business_group"
              value={editValues.business_group || row.original.business_group}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
            />
          ) : (
            row.original.business_group
          )
        )
      },
      {
        Header: 'Employee ID',
        accessor: 'employee_id',
        Cell: ({ row }) => (
          editMode ? (
            <input
              type="text"
              name="employee_id"
              value={editValues.employee_id || row.original.employee_id}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
            />
          ) : (
            row.original.employee_id
          )
        )
      },
    ],
    [editMode, darkMode, editValues, assets]
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

      <div className="mb-4 flex justify-between">
        <button
          onClick={handleExportToExcel}
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 text-gray-100 hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
        </button>
        <button
          onClick={handleEditAll}
          className={`px-4 py-2 rounded-md ${darkMode ? 'bg-yellow-600 text-gray-100 hover:bg-yellow-700' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
        >
          <FontAwesomeIcon icon={faEdit} /> {editMode ? 'Cancel Editing' : 'Edit All Fields'}
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
                  className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${editMode ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
                >
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      {cell.column.id !== 'actions' && ( // Skip actions column
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
    </div>
  );
};

export default AssetTable;
