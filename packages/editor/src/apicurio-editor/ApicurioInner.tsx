import {
  OpenApiEditor,
  OpenApiEditorProps,
  OpenApiEditorRef,
} from "@apicurio-editors/ui/src";
import { FunctionComponent, useCallback } from "react";

// import { worker } from "./rpc.ts";
import * as worker from "../../../ui/src/OpenApiEditorWorker.ts";
import { useRef } from "react";

interface ApicurioInnerProps {
  value: string;
  onChange: (value: string) => void;
}

export const ApicurioInner: FunctionComponent<ApicurioInnerProps> = ({
  value,
  onChange,
}) => {
  const editorRef = useRef<OpenApiEditorRef | null>(null);
  // const { showDebugger, showXStateInspector, spec, setSpec } = useAppContext();

  const onDocumentChange: OpenApiEditorProps["onDocumentChange"] =
    useCallback(() => {
      console.log("DOCUMENT_CHANGE");
      // this should probably be run in a debounce
      if (editorRef.current) {
        editorRef.current.getDocumentAsJson().then((minifiedSchema) => {
          const schema = JSON.stringify(JSON.parse(minifiedSchema), null, 2);

          onChange(schema);
        });
      }
    }, []);

  if (!value) {
    return null;
  }

  return (
    <OpenApiEditor
      ref={editorRef}
      spec={value}
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
    />
  );
};
