import { EditorToolbarProps } from "./EditorToolbar.tsx";
import { PageSection } from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { ReactNode } from "react";
import { NodeHeader } from "./NodeHeader.tsx";

export function SelectedNodeLayout({
  view,
  onViewChange,
  children,
}: { children: ReactNode } & EditorToolbarProps) {
  const { path } = OpenApiEditorMachineContext.useSelector(({ context }) => ({
    path:
      context.node && "path" in context.node
        ? context.node.path
        : context.node.node.title,
  }));
  return (
    <>
      <NodeHeader
        title={path}
        view={view}
        onViewChange={onViewChange}
        isClosable={true}
      />
      <PageSection>{children}</PageSection>
    </>
  );
}
