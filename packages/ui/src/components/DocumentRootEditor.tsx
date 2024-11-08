import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Flex, PageSection, Title } from "@patternfly/react-core";
import { EditorToolbar } from "./EditorToolbar.tsx";
import { CodeEditor, Language } from "@patternfly/react-code-editor";

export function DocumentRootEditor() {
  const { title, source } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => ({
      title: context.documentRoot.title,
      source: context.documentRoot.source,
    })
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();

  return (
    <>
      <PageSection stickyOnBreakpoint={{ default: "top" }}>
        <EditorToolbar
          view={"yaml"}
          onViewChange={() => {
            actorRef.send({ type: "GO_TO_DESIGNER_VIEW" });
          }}
        />
        <Title headingLevel={"h1"}>{title}</Title>
      </PageSection>
      <Flex>
        <CodeEditor
          isLineNumbersVisible={true}
          isMinimapVisible={true}
          isLanguageLabelVisible
          code={source}
          onChange={() => {}}
          language={Language.javascript}
          height="100%"
        />{" "}
      </Flex>
    </>
  );
}
