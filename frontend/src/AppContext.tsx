import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export interface AppContextType {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <AppContext.Provider value={{ loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};