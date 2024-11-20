import {
  Bullseye,
  Drawer,
  DrawerContent,
  DrawerPanelContent,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from "@patternfly/react-core";
import { createActorContext } from "@xstate/react";
import { fromPromise } from "xstate";
import { EditorSidebar } from "./components/EditorSidebar";
import { OpenApiEditorMachine } from "./OpenApiEditorMachine.ts";
import {
  DocumentDataType,
  DocumentNavigation,
  DocumentPath,
  DocumentResponse,
  DocumentRoot,
  EditorModel,
  NodeDataType,
  NodePath,
  NodeResponse,
  SelectedNode,
  Source,
  SourceType,
} from "./OpenApiEditorModels.ts";
import classes from "./OpenApiEditor.module.css";
import { DocumentDesigner } from "./documentDesigner/DocumentDesigner.tsx";
import { DocumentDesignerMachine } from "./documentDesigner/DocumentDesignerMachine.ts";
import { DocumentDesignerProvider } from "./documentDesigner/DocumentDesignerProvider.tsx";
import { ValidationMessages } from "./components/ValidationMessages.tsx";
import { DocumentDesignerSkeleton } from "./documentDesigner/DocumentDesignerSkeleton.tsx";
import { createBrowserInspector } from "@statelyai/inspect";
import { CodeEditorMachine } from "./codeEditor/CodeEditorMachine.ts";
import { CodeEditorProvider } from "./codeEditor/CodeEditorProvider.tsx";
import { CodeEditor } from "./codeEditor/CodeEditor.tsx";
import {
  ComponentProps,
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
import { Path } from "./components/Path.tsx";

const { inspect } = createBrowserInspector({
  autoStart: document.location.hostname === "localhost",
});

export type OpenApiEditorProps = {
  spec: string;
  parseOpenApi: (document: string) => Promise<void>;
  getEditorState: (filter: string) => Promise<EditorModel>;
  getDocumentRootSnapshot: () => Promise<DocumentRoot>;
  getPathSnapshot: (path: NodePath) => Promise<DocumentPath>;
  getDataTypeSnapshot: (path: NodeDataType) => Promise<DocumentDataType>;
  getResponseSnapshot: (path: NodeResponse) => Promise<DocumentResponse>;
  getNodeSource: (node: SelectedNode, type: SourceType) => Promise<Source>;
  convertSource: (source: string, sourceType: SourceType) => Promise<Source>;
  getDocumentNavigation: (filter: string) => Promise<DocumentNavigation>;
  updateDocumentTitle: (title: string) => Promise<void>;
  updateDocumentVersion: (version: string) => Promise<void>;
  updateDocumentDescription: (description: string) => Promise<void>;
  updateDocumentContactName: (contactName: string) => Promise<void>;
  updateDocumentContactEmail: (contactEmail: string) => Promise<void>;
  updateDocumentContactUrl: (contactUrl: string) => Promise<void>;
  undoChange: () => Promise<void>;
  redoChange: () => Promise<void>;
  onDocumentChange: () => void;
  enableViewer?: boolean;
  enableDesigner?: boolean;
  enableSource?: boolean;
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
      getDocumentRootSnapshot,
      getPathSnapshot,
      getDataTypeSnapshot,
      getResponseSnapshot,
      getNodeSource,
      getDocumentNavigation,
      convertSource,
      updateDocumentTitle,
      updateDocumentVersion,
      updateDocumentDescription,
      updateDocumentContactName,
      updateDocumentContactEmail,
      updateDocumentContactUrl,
      undoChange,
      redoChange,
      onDocumentChange,
      enableViewer = true,
      enableDesigner = true,
      enableSource = true,
    },
    ref
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
        getDocumentRootSnapshot: fromPromise(() => getDocumentRootSnapshot()),
        updateDocumentTitle: fromPromise(({ input }) =>
          updateDocumentTitle(input)
        ),
        updateDocumentVersion: fromPromise(({ input }) =>
          updateDocumentVersion(input)
        ),
        updateDocumentDescription: fromPromise(({ input }) =>
          updateDocumentDescription(input)
        ),
        updateDocumentContactName: fromPromise(({ input }) =>
          updateDocumentContactName(input)
        ),
        updateDocumentContactEmail: fromPromise(({ input }) =>
          updateDocumentContactEmail(input)
        ),
        updateDocumentContactUrl: fromPromise(({ input }) =>
          updateDocumentContactUrl(input)
        ),
      },
    });

    const pathDesigner = PathDesignerMachine.provide({
      actors: {
        getPathSnapshot: fromPromise(({ input }) => getPathSnapshot(input)),
      },
    });

    const dataTypeDesigner = DataTypeDesignerMachine.provide({
      actors: {
        getDataTypeSnapshot: fromPromise(({ input }) =>
          getDataTypeSnapshot(input)
        ),
      },
    });

    const responseDesigner = ResponseDesignerMachine.provide({
      actors: {
        getResponseSnapshot: fromPromise(({ input }) =>
          getResponseSnapshot(input)
        ),
      },
    });

    const codeEditor = CodeEditorMachine.provide({
      actors: {
        getNodeSource: fromPromise(({ input }) =>
          getNodeSource(input.node, input.type)
        ),
        convertSource: fromPromise(({ input }) =>
          convertSource(input.source, input.sourceType)
        ),
      },
    });

    const editorLogic = OpenApiEditorMachine.provide({
      actors: {
        parseOpenApi: fromPromise(({ input }) => parseOpenApi(input)),
        getEditorState: fromPromise(({ input }) => getEditorState(input)),
        getDocumentNavigation: fromPromise(({ input }) =>
          getDocumentNavigation(input)
        ),
        undoChange: fromPromise(() => undoChange()),
        redoChange: fromPromise(() => redoChange()),
        documentRootDesigner,
        pathDesigner,
        dataTypeDesigner,
        responseDesigner,
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
            enableViewer={enableViewer}
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
  }
);

type EditorProps = {
  spec: string;
  enableViewer: boolean;
  enableDesigner?: boolean;
  enableSource: boolean;
  getSourceAsYaml: () => Promise<string>;
  getSourceAsJson: () => Promise<string>;
};

const Editor = forwardRef<OpenApiEditorRef, EditorProps>(function Editor(
  {
    spec,
    enableViewer,
    enableDesigner,
    enableSource,
    getSourceAsYaml,
    getSourceAsJson,
  },
  ref
) {
  const {
    isSavingSlowly,
    showNavigation,
    documentTitle,
    selectedNode,
    view,
    spawnedMachineRef,
  } = OpenApiEditorMachineContext.useSelector(({ context, value }) => ({
    isSavingSlowly: value === "slowSaving",
    documentTitle: context.documentTitle,
    selectedNode: context.selectedNode,
    showNavigation: context.showNavigation,
    view: context.view,
    spawnedMachineRef: context.spawnedMachineRef,
  }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();

  const prevSpec = useRef(spec);
  useEffect(() => {
    if (prevSpec.current !== spec) {
      actorRef.send({ type: "NEW_SPEC", spec });
      prevSpec.current = spec;
    }
  }, [actorRef, spec]);

  useImperativeHandle(
    ref,
    () => {
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
    },
    []
  );

  const title = (() => {
    switch (selectedNode.type) {
      case "validation":
        return "Problems found";
      case "root":
        return documentTitle;
      case "path":
        return <Path path={selectedNode.path} />;
      case "datatype":
      case "response":
        return selectedNode.name;
    }
  })();
  const label = (() => {
    switch (selectedNode.type) {
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
        view={view}
        canGoBack={selectedNode.type !== "root"}
        enableViewer={enableViewer}
        enableDesigner={enableDesigner}
        enableSource={enableSource}
      />
      <Drawer
        isExpanded={showNavigation}
        isInline={true}
        position={"start"}
        className={`apicurio-editor ${classes.editor}`}
      >
        <DrawerContent
          panelContent={
            <DrawerPanelContent
              isResizable={true}
              widths={{ default: "width_33" }}
              className={"pf-v6-u-p-0"}
            >
              <EditorSidebar />
            </DrawerPanelContent>
          }
        >
          {(() => {
            switch (true) {
              case selectedNode.type === "validation":
                return <ValidationMessages />;
              case view === "design":
              case view === "visualize":
                switch (selectedNode.type) {
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
        </DrawerContent>
      </Drawer>
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
