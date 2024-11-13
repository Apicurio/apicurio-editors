import { ResponseDesignerSkeleton } from "./ResponseDesignerSkeleton.tsx";
import { Designer } from "./Designer.tsx";
import { useMachineSelector } from "./ResponseDesignerMachineContext.ts";

export function ResponseDesigner() {
  const isLoading = useMachineSelector((state) => state.value === "loading");

  switch (isLoading) {
    case true:
      return <ResponseDesignerSkeleton />;
    case false:
      return <Designer />;
  }
}
