import { ComponentProps, PropsWithChildren } from "react";
import { PathsDesignerMachineContext } from "./PathsDesignerMachineContext.ts";

type ProviderProps = ComponentProps<
  typeof PathsDesignerMachineContext.Provider
>;

export function PathsDesignerProvider({
  value,
  children,
}: PropsWithChildren<ProviderProps>) {
  return (
    <PathsDesignerMachineContext.Provider value={value}>
      {children}
    </PathsDesignerMachineContext.Provider>
  );
}
