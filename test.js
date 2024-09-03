app.get('/api/tables', async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT TableName FROM assets ORDER BY TableName');
    const tableNames = result.map(row => row.TableName);
    res.json(tableNames);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch table names' });
  }
});

app.get('/api/data/:tableName', async (req, res) => {
  const { tableName } = req.params;
  try {
    const data = await db.query('SELECT * FROM assets WHERE TableName = ?', [tableName]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch data from table ${tableName}` });
  }
});







import React, { useState, useEffect, useContext } from 'react';
import { TableContext } from './TableContext';

const MainPage = () => {
  const { selectedTable, setSelectedTable } = useContext(TableContext);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tables');
        if (!response.ok) throw new Error('Failed to fetch tables');
        const data = await response.json();
        setTables(data);
      } catch (error) {
        console.error('Failed to fetch tables:', error);
      }
    };

    fetchTables();
  }, []);

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
  };

  return (
    <div>
      <h1>Welcome to the Main Page</h1>
      <div>
        <label>Select Table:</label>
        <select onChange={handleTableChange} value={selectedTable}>
          {tables.map(table => (
            <option key={table} value={table}>{table}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MainPage;



import React, { createContext, useState } from 'react';

// Create the context
export const TableContext = createContext();

// Create a provider component
export const TableProvider = ({ children }) => {
  const [selectedTable, setSelectedTable] = useState('defaultTable'); // Set default or null

  return (
    <TableContext.Provider value={{ selectedTable, setSelectedTable }}>
      {children}
    </TableContext.Provider>
  );
};
