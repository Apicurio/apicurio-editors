import "./App.css";
import {
  OpenApiEditor,
  OpenApiEditorProps,
  OpenApiEditorRef,
} from "@apicurio-editors/ui/src";
import { SpecUploader } from "./components/SpecUploader";

import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { worker } from "./rpc.ts";
// import * as worker from "../../ui/src/OpenApiEditorWorker.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Flex,
  FlexItem,
  PageSection,
  Switch,
  TextArea,
  Title,
} from "@patternfly/react-core";
import { useAppContext } from "./AppContext.tsx";
import { createBrowserInspector } from "@statelyai/inspect";

// initialize Monaco's workers
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
  const [spec, setSpec] = useState<string | null>(null);
  const [captureChanges, setCaptureChanges] = useState(true);
  const [output, setOutput] = useState("");
  const { showDebugger, showXStateInspector } = useAppContext();
  const { inspect, start, stop } = createBrowserInspector({
    autoStart: false,
  });

  useEffect(() => {
    if (showXStateInspector) {
      start();
    } else {
      stop();
    }
  }, [showXStateInspector, start, stop]);

  const editorRef = useRef<OpenApiEditorRef | null>(null);

  const onDocumentChange: OpenApiEditorProps["onDocumentChange"] =
    useCallback(() => {
      console.log("DOCUMENT_CHANGE");
      // this should probably be run in a debounce
      if (captureChanges && editorRef.current) {
        editorRef.current.getDocumentAsYaml().then((v) => {
          setOutput(v.substring(0, 1000));
        });
      }
    }, [captureChanges]);

  const onSaveClick = useCallback(async () => {
    if (editorRef.current) {
      const value = await editorRef.current.getDocumentAsYaml();
      setOutput(value.substring(0, 1000));
      setSpec(`{
  "openapi": "3.0.3",
  "info": {
    "title": "Sample API"
    }
  }`);
      // or, you could do
      // editorRef.current.updateDocument(...newSpec...);
    }
  }, []);

  if (spec === null) {
    return <SpecUploader onSpec={setSpec} />;
  }
  return (
    <>
      <PageSection
        isFilled={true}
        padding={{ default: "noPadding" }}
        aria-label={"OpenApi designer"}
      >
        <OpenApiEditor
          ref={editorRef}
          spec={spec}
          parseOpenApi={worker.parseOpenApi}
          getEditorState={worker.getEditorState}
          getDocumentSnapshot={worker.getDocumentSnapshot}
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
          inspect={inspect}
        />
      </PageSection>
      {showDebugger && (
        <PageSection variant={"secondary"}>
          <Alert
            title={"Integration debugger"}
            variant={"warning"}
            isInline={true}
          >
            <Flex>
              <Title headingLevel={"h6"}>
                <Switch
                  isChecked={captureChanges}
                  onChange={(_, v) => setCaptureChanges(v)}
                  label={"Listen to onDocumentChange events"}
                />
              </Title>
              <TextArea
                aria-label="Output of the editor"
                value={output}
                rows={3}
              />
              <FlexItem>
                <Button onClick={onSaveClick}>
                  Programmatically save and update with another document
                </Button>
              </FlexItem>
            </Flex>
          </Alert>
        </PageSection>
      )}
    </>
  );
}

export default App;
