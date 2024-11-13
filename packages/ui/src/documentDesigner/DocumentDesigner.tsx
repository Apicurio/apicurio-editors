import { useMachineSelector } from "./DocumentDesignerMachineContext.ts";
import { DocumentDesignerSkeleton } from "./DocumentDesignerSkeleton.tsx";
import { Designer } from "./Designer.tsx";

export function DocumentDesigner() {
  const isLoading = useMachineSelector((state) => state.value === "loading");

  switch (isLoading) {
    case true:
      return <DocumentDesignerSkeleton />;
    case false:
      return <Designer />;
  }
}
