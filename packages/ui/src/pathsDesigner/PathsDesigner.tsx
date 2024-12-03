import { useMachineSelector } from "./PathsDesignerMachineContext.ts";
import { PathsDesignerSkeleton } from "./PathsDesignerSkeleton.tsx";
import { Designer } from "./Designer.tsx";

export function PathsDesigner() {
  const isLoading = useMachineSelector((state) => state.value === "loading");

  switch (isLoading) {
    case true:
      return <PathsDesignerSkeleton />;
    case false:
      return <Designer />;
  }
}
