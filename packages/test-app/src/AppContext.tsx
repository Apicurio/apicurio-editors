import {createContext, ReactNode, useContext, useState} from "react";

const AppContext = createContext<{
  showDebugger: boolean,
  showXStateInspector: boolean,
  setDebugger: (value: boolean) => void,
  setXStateInspector: (value: boolean) => void,
} | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [showDebugger, setDebugger] = useState(false);
  const [showXStateInspector, setXStateInspector] = useState(false);
  return (
    <AppContext.Provider value={{
      showDebugger,
      showXStateInspector,
      setDebugger,
      setXStateInspector
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}