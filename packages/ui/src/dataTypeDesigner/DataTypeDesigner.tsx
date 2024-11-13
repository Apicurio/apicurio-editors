import { DataTypeDesignerSkeleton } from "./DataTypeDesignerSkeleton.tsx";
import { Designer } from "./Designer.tsx";
import { useMachineSelector } from "./DataTypeDesignerMachineContext.ts";

export function DataTypeDesigner() {
  const isLoading = useMachineSelector((state) => state.value === "loading");

  switch (isLoading) {
    case true:
      return <DataTypeDesignerSkeleton />;
    case false:
      return <Designer />;
  }
}
