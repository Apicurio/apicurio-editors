import { ComponentProps, PropsWithChildren } from "react";
import { ResponseDesignerMachineContext } from "./ResponseDesignerMachineContext.ts";

type ProviderProps = ComponentProps<
  typeof ResponseDesignerMachineContext.Provider
>;

export function ResponseDesignerProvider({
  value,
  children,
}: PropsWithChildren<ProviderProps>) {
  return (
    <ResponseDesignerMachineContext.Provider value={value}>
      {children}
    </ResponseDesignerMachineContext.Provider>
  );
}
