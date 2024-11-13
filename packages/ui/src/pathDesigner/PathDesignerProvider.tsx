import { ComponentProps, PropsWithChildren } from "react";
import { PathDesignerMachineContext } from "./PathDesignerMachineContext.ts";

type ProviderProps = ComponentProps<typeof PathDesignerMachineContext.Provider>;

export function PathDesignerProvider({
  value,
  children,
}: PropsWithChildren<ProviderProps>) {
  return (
    <PathDesignerMachineContext.Provider value={value}>
      {children}
    </PathDesignerMachineContext.Provider>
  );
}
