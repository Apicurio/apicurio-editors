import "./App.css";
import { OpenApiEditor, OpenApiEditorProps } from "@apicurio-editors/ui/src";
import { useMachine } from "@xstate/react";
import { Loading } from "../../ui/src/components/Loading.tsx";
import { appMachine } from "./AppMachine.ts";
import { SpecUploader } from "./components/SpecUploader";

import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { worker } from "./rpc.ts";
import { useCallback, useState } from "react";
import { PageSection, TextArea, Title } from "@patternfly/react-core";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};
loader.config({ monaco });

function App() {
  const [state, send] = useMachine(appMachine, { input: { spec: undefined } });
  const [output, setOutput] = useState("");

  const onDocumentChange: OpenApiEditorProps["onDocumentChange"] = useCallback(
    ({ asJson, asYaml }) => {
      console.log("DOCUMENT_CHANGE");
      // this should be run in a debounce
      asYaml().then(setOutput);
    },
    []
  );

  switch (true) {
    case state.matches("idle"):
      return (
        <SpecUploader
          previousSpec={state.context.spec}
          onSpec={(content) => send({ type: "SPEC", content })}
        />
      );
    case state.matches("parsing"):
      return <Loading />;
    case state.matches("parsed"):
      return (
        <>
          <PageSection
            isFilled={true}
            padding={{ default: "noPadding" }}
            aria-label={"OpenApi designer"}
          >
            <OpenApiEditor
              getEditorState={worker.getEditorState}
              getDocumentRootSnapshot={worker.getDocumentRootSnapshot}
              getPathSnapshot={worker.getPathSnapshot}
              getDataTypeSnapshot={worker.getDataTypeSnapshot}
              getResponseSnapshot={worker.getResponseSnapshot}
              getNodeSource={worker.getNodeSource}
              getDocumentNavigation={worker.getDocumentNavigation}
              convertSource={worker.convertSource}
              updateDocumentTitle={worker.updateDocumentTitle}
              updateDocumentVersion={worker.updateDocumentVersion}
              updateDocumentDescription={worker.updateDocumentDescription}
              updateDocumentContactName={worker.updateDocumentContactName}
              updateDocumentContactEmail={worker.updateDocumentContactEmail}
              updateDocumentContactUrl={worker.updateDocumentContactUrl}
              undoChange={worker.undoChange}
              redoChange={worker.redoChange}
              onDocumentChange={onDocumentChange}
            />
          </PageSection>
          <PageSection variant={"secondary"}>
            <Title headingLevel={"h6"}>Editor output</Title>
            <TextArea
              aria-label="Output of the editor"
              value={output}
              rows={6}
            />
          </PageSection>
        </>
      );
    default:
      return <>Unknown state: {state.value}</>;
  }
}

export default App;
