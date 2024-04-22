// contexts/DateContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

//define the context type
interface DateContextType {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const DateContext = createContext<DateContextType>({} as DateContextType);

interface DateProviderProps {
    value: DateContextType;
    children: ReactNode;
  }
  

export const DateProvider: React.FC<DateProviderProps> = ({ children, value }) => {
    return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
  };

// Hook for easy usage of the context
export const useDate = () => useContext(DateContext);