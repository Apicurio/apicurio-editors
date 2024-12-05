import { useOpenApiEditorMachinePathsSelector } from "../../useOpenApiEditorMachine.ts";
import { PathsLayout } from "./PathsLayout.tsx";
import { useEditableSection } from "../../components/useEditableSection.ts";
import { PathsTree } from "./PathsTree.tsx";
import { PathsExplorer } from "./PathsExplorer.tsx";

export function Paths() {
  const isLoading = useOpenApiEditorMachinePathsSelector(
    ({ value }) => value === "loading",
  );
  switch (isLoading) {
    case true:
      return <PathsLayout />;
    case false:
      return <PathsLayout paths={<ConnectedPaths />} />;
  }
}

export function ConnectedPaths() {
  const isEditable = useEditableSection();
  return isEditable ? <PathsTree /> : <PathsExplorer />;
}
