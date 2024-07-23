import React, { useEffect, useState } from 'react';
import { useTable, useFilters, useSortBy } from 'react-table';

const AssetTable = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [editCell, setEditCell] = useState(null);
  const [editValue, setEditValue] = useState('');

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

  const handleEdit = (cell, rowIndex) => {
    setEditCell({ columnId: cell.column.id, rowIndex });
    setEditValue(cell.value);
  };

  const handleSave = async () => {
    const updatedAssets = [...assets];
    updatedAssets[editCell.rowIndex][editCell.columnId] = editValue;

    try {
      const response = await fetch(`http://localhost:5000/api/assets/${updatedAssets[editCell.rowIndex].asset_number}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAssets[editCell.rowIndex]),
      });
      if (!response.ok) {
        throw new Error('Failed to update asset');
      }
      setAssets(updatedAssets);
      setEditCell(null);
      setEditValue('');
    } catch (error) {
      console.error('Failed to update asset:', error);
    }
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
      // Add more columns as needed
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
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Central Database</h2>
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
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
                      onClick={() => handleEdit(cell, row.index)}
                    >
                      {editCell && editCell.rowIndex === row.index && editCell.columnId === cell.column.id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onBlur={handleSave}
                          className="w-full border-gray-300 rounded"
                          autoFocus
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
    </div>
  );
};

export default AssetTable;
