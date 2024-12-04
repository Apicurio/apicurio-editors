import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { setOptions, start } from "react-scan"; // import this BEFORE react

const AppContext = createContext<
  | {
      spec?: string;
      showDebugger: boolean;
      showXStateInspector: boolean;
      showReactScan: boolean;
      setSpec: (value?: string) => void;
      setDebugger: (value: boolean) => void;
      setXStateInspector: (value: boolean) => void;
      setReactScan: (value: boolean) => void;
    }
  | undefined
>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [spec, setSpec] = useState<string | undefined>(undefined);
  const [showDebugger, setDebugger] = useState(false);
  const [showXStateInspector, setXStateInspector] = useState(false);
  const [showReactScan, setReactScan] = useState(false);

  useEffect(() => {
    setOptions({
      enabled: showReactScan,
      playSound: true,
    });
    if (showReactScan) {
      start();
    }
  }, [showReactScan]);

  return (
    <AppContext.Provider
      value={{
        spec,
        showDebugger,
        showXStateInspector,
        showReactScan,
        setSpec,
        setDebugger,
        setXStateInspector,
        setReactScan,
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
