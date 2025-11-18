import React, { createContext, useContext, useState } from 'react';

interface FabContextType {
  fabVisible: boolean;
  setFabVisible: (visible: boolean) => void;
}

const FabContext = createContext<FabContextType | undefined>(undefined);

export function FabProvider({ children }: { children: React.ReactNode }) {
  const [fabVisible, setFabVisible] = useState(true);

  return (
    <FabContext.Provider value={{ fabVisible, setFabVisible }}>
      {children}
    </FabContext.Provider>
  );
}

export function useFab() {
  const context = useContext(FabContext);
  if (!context) {
    throw new Error('useFab must be used within FabProvider');
  }
  return context;
}
