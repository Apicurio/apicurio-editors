import { ComponentProps, PropsWithChildren } from "react";
import { DocumentDesignerMachineContext } from "./DocumentDesignerMachineContext.ts";

type ProviderProps = ComponentProps<typeof DocumentDesignerMachineContext.Provider>;

export function DocumentDesignerProvider({
  value,
  children,
}: PropsWithChildren<ProviderProps>) {
  return (
    <DocumentDesignerMachineContext.Provider value={value}>{children}</DocumentDesignerMachineContext.Provider>
  );
}
