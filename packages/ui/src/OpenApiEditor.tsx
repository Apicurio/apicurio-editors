import { createActorContext } from "@xstate/react";
import { fromPromise, InspectionEvent, Observer } from "xstate";
import { OpenApiEditorMachine } from "./OpenApiEditorMachine.ts";
import {
  DataType,
  Document,
  DocumentNavigation,
  EditorModel,
  Node,
  NodeDataType,
  NodePath,
  NodeResponse,
  Path,
  Paths,
  Response,
  Source,
  SourceType,
} from "./OpenApiEditorModels.ts";
import { OverviewMachine } from "./OpenApi/overview/OverviewMachine.ts";
import { CodeEditorMachine } from "./OpenApi/code/CodeEditorMachine.ts";
import { forwardRef, useLayoutEffect, useRef } from "react";
import { PathMachine } from "./OpenApi/path/PathMachine.ts";
import { DataTypeDesignerMachine } from "./OpenApi/dataType/DataTypeDesignerMachine.ts";
import { ResponseDesignerMachine } from "./OpenApi/response/ResponseDesignerMachine.ts";
import { PathsMachine } from "./OpenApi/paths/PathsMachine.ts";
import { Editor } from "./OpenApi/Editor.tsx";

export type OpenApiEditorProps = {
  spec: string;
  parseOpenApi: (document: string) => Promise<void>;
  getEditorState: () => Promise<EditorModel>;
  getDocumentSnapshot: () => Promise<Document>;
  getPathSnapshot: (path: NodePath) => Promise<Path>;
  getPathsSnapshot: () => Promise<Paths>;
  getDataTypeSnapshot: (path: NodeDataType) => Promise<DataType>;
  getResponseSnapshot: (path: NodeResponse) => Promise<Response>;
  getNodeSource: (node: Node, type: SourceType) => Promise<Source>;
  convertSource: (source: string, sourceType: SourceType) => Promise<Source>;
  getDocumentNavigation: (filter: string) => Promise<DocumentNavigation>;
  updateDocumentTitle: (title: string) => Promise<void>;
  updateDocumentVersion: (version: string) => Promise<void>;
  updateDocumentDescription: (description: string) => Promise<void>;
  updateDocumentContactName: (contactName: string) => Promise<void>;
  updateDocumentContactEmail: (contactEmail: string) => Promise<void>;
  updateDocumentContactUrl: (contactUrl: string) => Promise<void>;
  updatePathSummary: (node: NodePath, summary: string) => Promise<void>;
  updatePathDescription: (node: NodePath, summary: string) => Promise<void>;
  undoChange: () => Promise<Node | false>;
  redoChange: () => Promise<Node | false>;
  onDocumentChange: () => void;
  enableDesigner?: boolean;
  enableSource?: boolean;
  inspect?:
    | Observer<InspectionEvent>
    | ((inspectionEvent: InspectionEvent) => void);
};

export const OpenApiEditorMachineContext =
  createActorContext(OpenApiEditorMachine);

export interface OpenApiEditorRef {
  updateDocument: (spec: string) => void;
  getDocumentAsYaml: () => Promise<string>;
  getDocumentAsJson: () => Promise<string>;
}

export const OpenApiEditor = forwardRef<OpenApiEditorRef, OpenApiEditorProps>(
  function OpenApiEditor(
    {
      spec,
      parseOpenApi,
      getEditorState,
      getDocumentSnapshot,
      getPathSnapshot,
      getPathsSnapshot,
      getDataTypeSnapshot,
      getResponseSnapshot,
      getNodeSource,
      convertSource,
      updateDocumentTitle,
      updateDocumentVersion,
      updateDocumentDescription,
      updateDocumentContactName,
      updateDocumentContactEmail,
      updateDocumentContactUrl,
      updatePathSummary,
      updatePathDescription,
      undoChange,
      redoChange,
      onDocumentChange,
      enableDesigner = true,
      enableSource = true,
      inspect,
    },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      if (containerRef.current) {
        containerRef.current.parentElement!.style.position = "relative";
        containerRef.current.parentElement!.style.height = "100%";
      }
    }, []);

    const overviewDesigner = OverviewMachine.provide({
      actors: {
        getDocumentSnapshot: fromPromise(() => getDocumentSnapshot()),
        updateDocumentTitle: fromPromise(({ input }) =>
          updateDocumentTitle(input),
        ),
        updateDocumentVersion: fromPromise(({ input }) =>
          updateDocumentVersion(input),
        ),
        updateDocumentDescription: fromPromise(({ input }) =>
          updateDocumentDescription(input),
        ),
        updateDocumentContactName: fromPromise(({ input }) =>
          updateDocumentContactName(input),
        ),
        updateDocumentContactEmail: fromPromise(({ input }) =>
          updateDocumentContactEmail(input),
        ),
        updateDocumentContactUrl: fromPromise(({ input }) =>
          updateDocumentContactUrl(input),
        ),
      },
    });

    const pathsDesigner = PathsMachine.provide({
      actors: {
        getPathsSnapshot: fromPromise(() => getPathsSnapshot()),
      },
    });

    const pathDesigner = PathMachine.provide({
      actors: {
        getPathSnapshot: fromPromise(({ input }) => getPathSnapshot(input)),
        updateSummary: fromPromise(({ input }) =>
          updatePathSummary(input.node, input.summary),
        ),
        updateDescription: fromPromise(({ input }) =>
          updatePathDescription(input.node, input.description),
        ),
      },
    });

    const dataTypeDesigner = DataTypeDesignerMachine.provide({
      actors: {
        getDataTypeSnapshot: fromPromise(({ input }) =>
          getDataTypeSnapshot(input),
        ),
      },
    });

    const responseDesigner = ResponseDesignerMachine.provide({
      actors: {
        getResponseSnapshot: fromPromise(({ input }) =>
          getResponseSnapshot(input),
        ),
      },
    });

    const codeEditor = CodeEditorMachine.provide({
      actors: {
        getNodeSource: fromPromise(({ input }) =>
          getNodeSource(input.node, input.type),
        ),
        convertSource: fromPromise(({ input }) =>
          convertSource(input.source, input.sourceType),
        ),
      },
    });

    const editorLogic = OpenApiEditorMachine.provide({
      actors: {
        parseOpenApi: fromPromise(({ input }) => parseOpenApi(input)),
        getEditorState: fromPromise(() => getEditorState()),
        undoChange: fromPromise(() => undoChange()),
        redoChange: fromPromise(() => redoChange()),
        overviewDesigner,
        pathDesigner,
        dataTypeDesigner,
        responseDesigner,
        pathsDesigner,
        codeEditor,
      },
      actions: {
        onDocumentChange,
      },
    });
    return (
      <OpenApiEditorMachineContext.Provider
        logic={editorLogic}
        options={{
          systemId: "editor",
          input: {
            spec,
          },
          inspect,
        }}
      >
        <div
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            overflow: "hidden",
            display: "flex",
            flexFlow: "column",
          }}
          ref={containerRef}
          id={"editor-container"}
        >
          <Editor
            ref={ref}
            spec={spec}
            enableDesigner={enableDesigner}
            enableSource={enableSource}
            getSourceAsJson={() =>
              getNodeSource({ type: "root" }, "json").then((s) => s.source)
            }
            getSourceAsYaml={() =>
              getNodeSource({ type: "root" }, "yaml").then((s) => s.source)
            }
          />
        </div>
      </OpenApiEditorMachineContext.Provider>
    );
  },
);
