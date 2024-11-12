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
  const { title } = OpenApiEditorMachineContext.useSelector(({ context }) => {
    const title = (() => {
      switch (context.node.type) {
        case "root":
          return context.node.node.title;
        case "path":
          return context.node.path;
        case "datatype":
          return context.node.name;
        case "response":
          return context.node.name;
      }
    })();
    return {
      title,
    };
  });
  return (
    <>
      <NodeHeader
        title={title}
        view={view}
        onViewChange={onViewChange}
        isClosable={true}
      />
      <PageSection>{children}</PageSection>
    </>
  );
}
