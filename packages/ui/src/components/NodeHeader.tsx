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
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <PageSection stickyOnBreakpoint={{ default: "top" }}>
      <EditorToolbar
        label={label}
        title={title ?? <Skeleton className={classes.skeleton} />}
        view={view}
        onViewChange={(view) => {
          switch (view) {
            case "visualize":
              actorRef.send({ type: "GO_TO_VISUALIZER_VIEW" });
              break;
            case "design":
              actorRef.send({ type: "GO_TO_DESIGNER_VIEW" });
              break;
            case "code":
              actorRef.send({ type: "GO_TO_CODE_VIEW" });
              break;
            case "hidden":
              break;
          }
        }}
        canGoBack={canGoBack}
        onBack={() => {
          switch (view) {
            case "design":
              actorRef.send({
                type: "SELECT_DOCUMENT_ROOT_DESIGNER",
              });
              break;
            case "code":
              actorRef.send({
                type: "SELECT_DOCUMENT_ROOT_CODE",
              });
              break;
            case "visualize":
              actorRef.send({
                type: "SELECT_DOCUMENT_ROOT_VISUALIZER",
              });
              break;
            case "hidden":
              actorRef.send({
                type: "SELECT_DOCUMENT_ROOT_VISUALIZER",
              });
              break;
          }
        }}
      />
    </PageSection>
  );
}
