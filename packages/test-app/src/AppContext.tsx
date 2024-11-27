import { createContext, ReactNode, useContext, useState } from "react";

const AppContext = createContext<
  | {
      spec?: string;
      showDebugger: boolean;
      showXStateInspector: boolean;
      setSpec: (value?: string) => void;
      setDebugger: (value: boolean) => void;
      setXStateInspector: (value: boolean) => void;
    }
  | undefined
>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [spec, setSpec] = useState<string | undefined>(undefined);
  const [showDebugger, setDebugger] = useState(false);
  const [showXStateInspector, setXStateInspector] = useState(false);
  return (
    <AppContext.Provider
      value={{
        spec,
        showDebugger,
        showXStateInspector,
        setSpec,
        setDebugger,
        setXStateInspector,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
