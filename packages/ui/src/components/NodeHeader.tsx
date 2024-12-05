import { PageSection, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
import { Node } from "../OpenApiEditorModels.ts";
import { EditorToolbar, EditorToolbarProps } from "./EditorToolbar.tsx";
import { RefObject } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

export function NodeHeader({
  canGoBack,
  canGoForward,
  enableDesigner,
  enableSource,
  onBack,
  onForward,
  currentNode,
  mode,
  onViewChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  contentRef,
}: {
  contentRef: RefObject<unknown>;
  currentNode: Node | { type: "validation" };
} & EditorToolbarProps) {
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const typeToTabMapping: Record<typeof currentNode.type, number> = {
    root: 0,
    path: 1,
    response: 2,
    datatype: 3,
    validation: 10,
    paths: 1,
    datatypes: 3,
    responses: 2,
  };
  const activeKey = typeToTabMapping[currentNode.type];
  return (
    <>
      <PageSection>
        <EditorToolbar
          mode={mode}
          enableDesigner={enableDesigner}
          enableSource={enableSource}
          onViewChange={onViewChange}
          canGoBack={canGoBack}
          onBack={onBack}
          canGoForward={canGoForward}
          onForward={onForward}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
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
                  mode === "design"
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
                  mode === "design"
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
                  mode === "design"
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
                  mode === "design"
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
