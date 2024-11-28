import { useSection } from "../components/Section.tsx";
import { useMachineSelector } from "./DocumentDesignerMachineContext.ts";
import { PathsTree } from "./PathsTree.tsx";
import { PathsExplorer } from "./PathsExplorer.tsx";

export function Paths() {
  const { editable } = useMachineSelector(({ context }) => ({
    editable: context.editable,
  }));
  const view = useSection();
  const isEditable = view === "designer" || editable;
  return isEditable ? <PathsTree /> : <PathsExplorer />;
}
