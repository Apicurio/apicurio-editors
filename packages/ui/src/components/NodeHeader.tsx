import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { EditorToolbar, EditorToolbarProps } from "./EditorToolbar.tsx";
import { ReactNode } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

export function NodeHeader({
  title,
  view,
  isClosable,
  onViewChange,
}: { title: ReactNode; isClosable: boolean } & EditorToolbarProps) {
  const { isDesignerView } = OpenApiEditorMachineContext.useSelector(
    (state) => ({
      isDesignerView: state.tags.has("designer") || view === "no-code",
    })
  );

  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <PageSection stickyOnBreakpoint={{ default: "top" }}>
      <EditorToolbar view={view} onViewChange={onViewChange} />
      <DrawerHead className={"pf-v6-u-p-0"}>
        <Title headingLevel={"h1"}>{title}</Title>
        {isClosable && (
          <DrawerActions>
            <DrawerCloseButton
              onClick={() =>
                actorRef.send({
                  type: isDesignerView
                    ? "SELECT_DOCUMENT_ROOT_DESIGNER"
                    : "SELECT_DOCUMENT_ROOT_CODE",
                })
              }
            />
          </DrawerActions>
        )}
      </DrawerHead>
    </PageSection>
  );
}
