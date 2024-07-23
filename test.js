import React, { useEffect, useState } from 'react';
import { useTable, useFilters, useSortBy, useGlobalFilter } from 'react-table';
import 'tailwindcss/tailwind.css'; // Ensure TailwindCSS is imported

const AssetTable = ({ darkMode }) => {
  const [assets, setAssets] = useState([]);
  const [businessGroups, setBusinessGroups] = useState([]);

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
      const uniqueBusinessGroups = [...new Set(data.map(asset => asset.business_group))];
      setBusinessGroups(uniqueBusinessGroups);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
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
        Filter: SelectColumnFilter,
        filter: 'includes',
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
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: assets,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  return (
    <div className={`container mx-auto p-4 ${darkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">Central Database</h1>

      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Search:
        </label>
        <input
          id="search"
          type="text"
          value={state.globalFilter || ''}
          onChange={e => setGlobalFilter(e.target.value || undefined)}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="business-group-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter by Business Group:
        </label>
        <select
          id="business-group-filter"
          onChange={e => setGlobalFilter(e.target.value || undefined)}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${darkMode ? 'bg-gray-800 border-gray-600 text-gray-300' : 'border-gray-300 bg-white text-gray-900'}`}
        >
          <option value="">All</option>
          {businessGroups.map((group, index) => (
            <option key={index} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full bg-white dark:bg-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-700">
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
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
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

// Custom Select Column Filter
const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach(row => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default AssetTable;
