import React, { createContext, useState } from 'react';

// Create the context
export const YearContext = createContext();

// Create a provider component
export const YearProvider = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState(2021); // Default year

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </YearContext.Provider>
  );
};




