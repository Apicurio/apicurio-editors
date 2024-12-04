import {
  PageSection,
  Skeleton,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
import { EditorToolbar, EditorToolbarProps } from "./EditorToolbar.tsx";
import { ReactNode, RefObject } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import classes from "./FadeInSkeleton.module.css";

export function NodeHeader({
  title,
  label,
  canGoBack,
  enableDesigner,
  enableSource,
  contentRef,
}: {
  title?: ReactNode;
  label?: ReactNode;
  canGoBack: boolean;
  contentRef: RefObject<unknown>;
} & Omit<EditorToolbarProps, "onViewChange" | "onBack" | "view">) {
  const { selectedNode, view, canUndo, canRedo } =
    OpenApiEditorMachineContext.useSelector(({ context }) => ({
      selectedNode: context.selectedNode,
      view: context.view,
      canUndo: context.canUndo,
      canRedo: context.canRedo,
    }));
  console.log({ selectedNode, view, canUndo, canRedo });
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const typeToTabMapping: Record<typeof selectedNode.type, number> = {
    root: 0,
    path: 1,
    response: 2,
    datatype: 3,
    validation: 10,
    paths: 1,
    datatypes: 3,
    responses: 2,
  };
  const activeKey = typeToTabMapping[selectedNode.type];
  return (
    <>
      <PageSection>
        <EditorToolbar
          label={label}
          title={title ?? <Skeleton className={classes.skeleton} />}
          view={view}
          enableDesigner={enableDesigner}
          enableSource={enableSource}
          onViewChange={(view) => {
            switch (view) {
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
            }
          }}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => {
            actorRef.send({ type: "UNDO" });
          }}
          onRedo={() => {
            actorRef.send({ type: "REDO" });
          }}
        />
      </PageSection>
      <PageSection type={"tabs"}>
        <Tabs activeKey={activeKey}>
          <Tab
            eventKey={0}
            title={<TabTitleText>Overview</TabTitleText>}
            tabContentId={"content"}
            tabContentRef={contentRef}
            onClick={() => {
              actorRef.send({
                type:
                  view === "design"
                    ? "SELECT_DOCUMENT_ROOT_DESIGNER"
                    : "SELECT_DOCUMENT_ROOT_CODE",
              });
            }}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>Paths</TabTitleText>}
            tabContentId={"content"}
            tabContentRef={contentRef}
            onClick={() => {
              actorRef.send({
                type:
                  view === "design"
                    ? "SELECT_PATHS_DESIGNER"
                    : "SELECT_PATHS_CODE",
              });
            }}
          />
          <Tab
            eventKey={2}
            title={<TabTitleText>Responses</TabTitleText>}
            tabContentId={"content"}
            tabContentRef={contentRef}
            onClick={() => {
              actorRef.send({
                type:
                  view === "design"
                    ? "SELECT_RESPONSES_DESIGNER"
                    : "SELECT_RESPONSES_CODE",
              });
            }}
          />
          <Tab
            eventKey={3}
            title={<TabTitleText>Data types</TabTitleText>}
            tabContentId={"content"}
            tabContentRef={contentRef}
            onClick={() => {
              actorRef.send({
                type:
                  view === "design"
                    ? "SELECT_DATATYPES_DESIGNER"
                    : "SELECT_DATATYPES_CODE",
              });
            }}
          />
          <Tab
            eventKey={4}
            title={<TabTitleText>Tags</TabTitleText>}
            tabContentId={"content"}
            tabContentRef={contentRef}
          />
          <Tab
            eventKey={5}
            title={<TabTitleText>Servers</TabTitleText>}
            tabContentId={"content"}
            tabContentRef={contentRef}
          />
          <Tab
            eventKey={6}
            title={<TabTitleText>Security schemes</TabTitleText>}
            tabContentId={"content"}
            tabContentRef={contentRef}
          />
          <Tab
            eventKey={7}
            title={<TabTitleText>Security requirements</TabTitleText>}
            tabContentId={"content"}
            tabContentRef={contentRef}
          />
        </Tabs>
      </PageSection>
    </>
  );
}
