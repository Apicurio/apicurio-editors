import { ComponentProps, PropsWithChildren } from "react";
import { CodeEditorMachineContext } from "./CodeEditorMachineContext.ts";

type ProviderProps = ComponentProps<typeof CodeEditorMachineContext.Provider>;

export function CodeEditorProvider({
  value,
  children,
}: PropsWithChildren<ProviderProps>) {
  return (
    <CodeEditorMachineContext.Provider value={value}>
      {children}
    </CodeEditorMachineContext.Provider>
  );
}
