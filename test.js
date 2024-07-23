import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useTable, useFilters, useSortBy } from 'react-table';

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

  const handleEditClick = (asset) => {
    setEditAssetId(asset.id);
    setEditValues({
      asset_number: asset.asset_number,
      login_id: asset.login_id,
      business_group: asset.business_group,
      employee_id: asset.employee_id
    });
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

  const handleCancelEdit = () => {
    setEditAssetId(null);
    setEditValues({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditValues({
      ...editValues,
      [name]: value
    });
  };

  const handleDelete = async (assetId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/assets/${assetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }
      setAssets(assets.filter((asset) => asset.id !== assetId));
    } catch (error) {
      console.error('Failed to delete asset:', error);
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
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            {editAssetId === row.original.id ? (
              <>
                <button
                  onClick={handleSaveClick}
                  className={`px-3 py-1 rounded-md ${darkMode ? 'bg-green-600 text-gray-100 hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
                >
                  <FontAwesomeIcon icon={faSave} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`px-3 py-1 rounded-md ${darkMode ? 'bg-red-600 text-gray-100 hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </>
            ) : null}
            {editAssetId !== row.original.id && (
              <>
                <button
                  onClick={() => handleEditClick(row.original)}
                  className={`px-3 py-1 rounded-md ${darkMode ? 'bg-blue-600 text-gray-100 hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(row.original.id)}
                  className={`px-3 py-1 rounded-md ${darkMode ? 'bg-red-600 text-gray-100 hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </>
            )}
          </div>
        )
      },
    ],
    [editAssetId, darkMode]
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
                  className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${editAssetId === row.original.id ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
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
                          value={editValues[cell.column.id] || ''}
                          onChange={handleChange}
                          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
                        />
                      ) : (
                        cell.render('Cell')
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    <div className="flex space-x-2">
                      {editAssetId === row.original.id ? (
                        <>
                          <button
                            onClick={handleSaveClick}
                            className={`px-3 py-1 rounded-md ${darkMode ? 'bg-green-600 text-gray-100 hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`}
                          >
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className={`px-3 py-1 rounded-md ${darkMode ? 'bg-red-600 text-gray-100 hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </>
                      ) : null}
                      {editAssetId !== row.original.id && (
                        <>
                          <button
                            onClick={() => handleEditClick(row.original)}
                            className={`px-3 py-1 rounded-md ${darkMode ? 'bg-blue-600 text-gray-100 hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDelete(row.original.id)}
                            className={`px-3 py-1 rounded-md ${darkMode ? 'bg-red-600 text-gray-100 hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}`}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
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
