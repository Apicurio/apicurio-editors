import { PageSection, Skeleton } from "@patternfly/react-core";
import { EditorToolbar, EditorToolbarProps } from "./EditorToolbar.tsx";
import { ReactNode } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import classes from "./FadeInSkeleton.module.css";

export function NodeHeader({
  title,
  label,
  view,
  canGoBack,
}: { title?: ReactNode; label?: ReactNode; canGoBack: boolean } & Omit<
  EditorToolbarProps,
  "onViewChange" | "onBack"
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
        label={label}
        title={title ?? <Skeleton className={classes.skeleton} />}
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
        canGoBack={canGoBack}
        onBack={() =>
          actorRef.send({
            type: isDesignerView
              ? "SELECT_DOCUMENT_ROOT_DESIGNER"
              : "SELECT_DOCUMENT_ROOT_CODE",
          })
        }
      />
    </PageSection>
  );
}
