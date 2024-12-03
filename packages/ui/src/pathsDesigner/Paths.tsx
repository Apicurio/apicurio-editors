import { PathsTree } from "./PathsTree.tsx";
import { PathsExplorer } from "./PathsExplorer.tsx";
import { useEditableSection } from "./useEditableSection.ts";

export function Paths() {
  const isEditable = useEditableSection();
  return isEditable ? <PathsTree /> : <PathsExplorer />;
}
