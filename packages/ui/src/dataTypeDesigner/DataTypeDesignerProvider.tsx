import { ComponentProps, PropsWithChildren } from "react";
import { DataTypeDesignerMachineContext } from "./DataTypeDesignerMachineContext.ts";

type ProviderProps = ComponentProps<
  typeof DataTypeDesignerMachineContext.Provider
>;

export function DataTypeDesignerProvider({
  value,
  children,
}: PropsWithChildren<ProviderProps>) {
  return (
    <DataTypeDesignerMachineContext.Provider value={value}>
      {children}
    </DataTypeDesignerMachineContext.Provider>
  );
}
