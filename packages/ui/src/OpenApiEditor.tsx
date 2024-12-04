import {
  Bullseye,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  PageSection,
  Spinner,
} from "@patternfly/react-core";
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
import { DocumentDesigner } from "./documentDesigner/DocumentDesigner.tsx";
import { DocumentDesignerMachine } from "./documentDesigner/DocumentDesignerMachine.ts";
import { DocumentDesignerProvider } from "./documentDesigner/DocumentDesignerProvider.tsx";
import { ValidationMessages } from "./components/ValidationMessages.tsx";
import { DocumentDesignerSkeleton } from "./documentDesigner/DocumentDesignerSkeleton.tsx";
import { CodeEditorMachine } from "./codeEditor/CodeEditorMachine.ts";
import { CodeEditorProvider } from "./codeEditor/CodeEditorProvider.tsx";
import { CodeEditor } from "./codeEditor/CodeEditor.tsx";
import {
  ComponentProps,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { PathDesignerMachine } from "./pathDesigner/PathDesignerMachine.ts";
import { PathDesignerProvider } from "./pathDesigner/PathDesignerProvider.tsx";
import { PathDesignerSkeleton } from "./pathDesigner/PathDesignerSkeleton.tsx";
import { PathDesigner } from "./pathDesigner/PathDesigner.tsx";
import { DataTypeDesignerMachine } from "./dataTypeDesigner/DataTypeDesignerMachine.ts";
import { DataTypeDesignerProvider } from "./dataTypeDesigner/DataTypeDesignerProvider.tsx";
import { DataTypeDesigner } from "./dataTypeDesigner/DataTypeDesigner.tsx";
import { DataTypeDesignerSkeleton } from "./dataTypeDesigner/DataTypeDesignerSkeleton.tsx";
import { ResponseDesignerMachine } from "./responseDesigner/ResponseDesignerMachine.ts";
import { ResponseDesignerProvider } from "./responseDesigner/ResponseDesignerProvider.tsx";
import { ResponseDesigner } from "./responseDesigner/ResponseDesigner.tsx";
import { ResponseDesignerSkeleton } from "./responseDesigner/ResponseDesignerSkeleton.tsx";
import { NodeHeader } from "./components/NodeHeader.tsx";
import { PathBreadcrumb } from "./components/PathBreadcrumb.tsx";
import classes from "./OpenApiEditor.module.css";
import { PathsDesigner } from "./pathsDesigner/PathsDesigner.tsx";
import { PathsDesignerProvider } from "./pathsDesigner/PathsDesignerProvider.tsx";
import { PathsDesignerMachine } from "./pathsDesigner/PathsDesignerMachine.ts";

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

    const documentRootDesigner = DocumentDesignerMachine.provide({
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

    const pathsDesigner = PathsDesignerMachine.provide({
      actors: {
        getPathsSnapshot: fromPromise(() => getPathsSnapshot()),
      },
    });

    const pathDesigner = PathDesignerMachine.provide({
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
        documentRootDesigner,
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

type EditorProps = {
  spec: string;
  enableDesigner?: boolean;
  enableSource: boolean;
  getSourceAsYaml: () => Promise<string>;
  getSourceAsJson: () => Promise<string>;
};

const Editor = forwardRef<OpenApiEditorRef, EditorProps>(function Editor(
  { spec, enableDesigner, enableSource, getSourceAsYaml, getSourceAsJson },
  ref,
) {
  const {
    isSavingSlowly,
    documentTitle,
    currentNode,
    view,
    canUndo,
    canRedo,
    canGoBack,
    canGoForward,
    spawnedMachineRef,
  } = OpenApiEditorMachineContext.useSelector(({ context, value }) => ({
    isSavingSlowly: value === "slowSaving",
    documentTitle: context.documentTitle,
    view: context.view,
    spawnedMachineRef: context.spawnedMachineRef,
    currentNode: context.currentNode,
    canUndo: context.canUndo,
    canRedo: context.canRedo,
    canGoBack: context.historyPosition > 0,
    canGoForward: context.historyPosition < context.history.length - 1,
  }));

  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const contentRef = createRef<HTMLDivElement>();

  const prevSpec = useRef(spec);
  useEffect(() => {
    if (prevSpec.current !== spec) {
      actorRef.send({ type: "NEW_SPEC", spec });
      prevSpec.current = spec;
    }
  }, [actorRef, spec]);

  useImperativeHandle(ref, () => {
    return {
      updateDocument: (spec: string) => {
        actorRef.send({ type: "NEW_SPEC", spec });
      },
      getDocumentAsYaml: () => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            actorRef.send({ type: "START_SAVING" });
            const source = await getSourceAsYaml();
            actorRef.send({ type: "END_SAVING" });
            resolve(source);
          }, 0);
        });
      },
      getDocumentAsJson: () => {
        return new Promise((resolve) => {
          setTimeout(async () => {
            actorRef.send({ type: "START_SAVING" });
            const source = await getSourceAsJson();
            actorRef.send({ type: "END_SAVING" });
            resolve(source);
          }, 0);
        });
      },
    };
  }, [actorRef, getSourceAsJson, getSourceAsYaml]);

  const title = (() => {
    switch (currentNode.type) {
      case "validation":
        return "Problems found";
      case "root":
        return documentTitle;
      case "path":
        return <PathBreadcrumb path={currentNode.path} />;
      case "datatype":
      case "response":
        return currentNode.name;
    }
  })();
  const label = (() => {
    switch (currentNode.type) {
      case "validation":
      case "root":
        return <Label color={"yellow"}>OpenApi</Label>;
      case "path":
        return <Label color={"green"}>Path</Label>;
      case "datatype":
        return <Label color={"blue"}>Data type</Label>;
      case "response":
        return <Label color={"orange"}>Response</Label>;
    }
  })();
  return (
    <>
      <NodeHeader
        title={title}
        label={label}
        canUndo={canUndo}
        canRedo={canRedo}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        enableDesigner={enableDesigner}
        enableSource={enableSource}
        contentRef={contentRef}
        view={view}
        currentNode={currentNode}
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
        onUndo={() => {
          actorRef.send({ type: "UNDO" });
        }}
        onRedo={() => {
          actorRef.send({ type: "REDO" });
        }}
        onBack={() => {
          actorRef.send({ type: "BACK" });
        }}
        onForward={() => {
          actorRef.send({ type: "FORWARD" });
        }}
      />
      <PageSection
        aria-label={"Editor content"}
        ref={contentRef}
        className={classes.editor}
        data-apicurio-editor
        padding={{ default: "noPadding" }}
      >
        {(() => {
          switch (true) {
            case currentNode.type === "validation":
              return <ValidationMessages />;
            case view === "design":
              switch (currentNode.type) {
                case "root":
                  return spawnedMachineRef ? (
                    <DocumentDesignerProvider
                      value={
                        spawnedMachineRef as ComponentProps<
                          typeof DocumentDesignerProvider
                        >["value"]
                      }
                    >
                      <DocumentDesigner />
                    </DocumentDesignerProvider>
                  ) : (
                    <DocumentDesignerSkeleton />
                  );
                case "paths":
                  return spawnedMachineRef ? (
                    <PathsDesignerProvider
                      value={
                        spawnedMachineRef as ComponentProps<
                          typeof PathsDesignerProvider
                        >["value"]
                      }
                    >
                      <PathsDesigner />
                    </PathsDesignerProvider>
                  ) : (
                    <DocumentDesignerSkeleton />
                  );
                case "path":
                  return spawnedMachineRef ? (
                    <PathDesignerProvider
                      value={
                        spawnedMachineRef as ComponentProps<
                          typeof PathDesignerProvider
                        >["value"]
                      }
                    >
                      <PathDesigner />
                    </PathDesignerProvider>
                  ) : (
                    <PathDesignerSkeleton />
                  );
                case "datatype":
                  return spawnedMachineRef ? (
                    <DataTypeDesignerProvider
                      value={
                        spawnedMachineRef as ComponentProps<
                          typeof DataTypeDesignerProvider
                        >["value"]
                      }
                    >
                      <DataTypeDesigner />
                    </DataTypeDesignerProvider>
                  ) : (
                    <DataTypeDesignerSkeleton />
                  );
                case "response":
                  return spawnedMachineRef ? (
                    <ResponseDesignerProvider
                      value={
                        spawnedMachineRef as ComponentProps<
                          typeof ResponseDesignerProvider
                        >["value"]
                      }
                    >
                      <ResponseDesigner />
                    </ResponseDesignerProvider>
                  ) : (
                    <ResponseDesignerSkeleton />
                  );
              }
              break;
            case view === "code":
              return (
                <CodeEditorProvider
                  value={
                    spawnedMachineRef as ComponentProps<
                      typeof CodeEditorProvider
                    >["value"]
                  }
                >
                  <CodeEditor />
                </CodeEditorProvider>
              );
          }
        })()}
      </PageSection>
      <Modal
        isOpen={isSavingSlowly}
        aria-labelledby="modal-title"
        aria-describedby="modal-box-body"
        disableFocusTrap={true}
        variant={"small"}
        appendTo={() => document.getElementById("editor-container")!}
      >
        <ModalHeader title="Saving in progress..." labelId="modal-title" />
        <ModalBody id="modal-box-body">
          <Bullseye>
            <Spinner size={"xl"} />
          </Bullseye>
        </ModalBody>
      </Modal>
    </>
  );
});
