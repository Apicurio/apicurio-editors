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
}: { title: ReactNode; isClosable: boolean } & Omit<
  EditorToolbarProps,
  "onViewChange"
>) {
  const { isDesignerView } = OpenApiEditorMachineContext.useSelector(
    (state) => ({
      isDesignerView: state.context.view === "designer",
    })
  );

  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <PageSection stickyOnBreakpoint={{ default: "top" }}>
      <EditorToolbar
        view={view}
        onViewChange={(view) => {
          switch (view) {
            case "designer":
              actorRef.send({ type: "GO_TO_CODE_VIEW" });
              break;
            case "code":
              actorRef.send({ type: "GO_TO_DESIGNER_VIEW" });
              break;
            case "no-code":
              break;
          }
        }}
      />
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
