import { PathDesignerSkeleton } from "./PathDesignerSkeleton.tsx";
import { Designer } from "./Designer.tsx";
import { useMachineSelector } from "./PathDesignerMachineContext.ts";

export function PathDesigner() {
  const isLoading = useMachineSelector((state) => state.value === "loading");

  switch (isLoading) {
    case true:
      return <PathDesignerSkeleton />;
    case false:
      return <Designer />;
  }
}
