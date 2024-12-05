import { DataTypeDesignerSkeleton } from "./DataTypeDesignerSkeleton.tsx";
import { Designer } from "./Designer.tsx";
import { useMachineSelector } from "./DataTypeDesignerMachineContext.ts";

export function DataTypeDesigner() {
  const { isLoading, title } = useMachineSelector((state) => ({
    isLoading: state.value === "loading",
    title: state.context.dataType.name,
  }));

  switch (isLoading) {
    case true:
      return <DataTypeDesignerSkeleton title={title} />;
    case false:
      return <Designer title={title} />;
  }
}
