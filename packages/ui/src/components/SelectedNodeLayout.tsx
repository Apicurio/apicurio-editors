import { EditorToolbar, EditorToolbarProps } from "./EditorToolbar.tsx";
import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { ReactNode } from "react";

export function SelectedNodeLayout({
  view,
  onViewChange,
  children,
}: { children: ReactNode } & EditorToolbarProps) {
  const { path } = OpenApiEditorMachineContext.useSelector(({ context }) => ({
    path:
      context.selectedNode && "path" in context.selectedNode
        ? context.selectedNode.path
        : undefined,
  }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <>
      <PageSection stickyOnBreakpoint={{ default: "top" }}>
        <EditorToolbar view={view} onViewChange={onViewChange} />
        <DrawerHead className={"pf-v6-u-p-0"}>
          <Title headingLevel={"h1"}>{path}</Title>
          <DrawerActions>
            <DrawerCloseButton
              onClick={() => actorRef.send({ type: "SELECT_DOCUMENT_ROOT" })}
            />
          </DrawerActions>
        </DrawerHead>
      </PageSection>
      <PageSection>{children}</PageSection>
    </>
  );
}
