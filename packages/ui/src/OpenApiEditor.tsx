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
import { ComponentProps, useLayoutEffect, useRef } from "react";
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
  onDocumentChange: (callbacks: {
    asYaml: () => Promise<string>;
    asJson: () => Promise<string>;
  }) => void;
};

export const OpenApiEditorMachineContext =
  createActorContext(OpenApiEditorMachine);

export function OpenApiEditor({
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
}: OpenApiEditorProps) {
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
      onDocumentChange: ({ self }) => {
        onDocumentChange({
          asYaml: () => {
            return new Promise((resolve) => {
              setTimeout(async () => {
                self.send({ type: "START_SAVING" });
                const source = await getNodeSource({ type: "root" }, "yaml");
                self.send({ type: "END_SAVING" });
                resolve(source.source);
              }, 0);
            });
          },
          asJson: () => {
            return new Promise((resolve) => {
              setTimeout(async () => {
                self.send({ type: "START_SAVING" });
                const source = await getNodeSource({ type: "root" }, "json");
                self.send({ type: "END_SAVING" });
                resolve(source.source);
              }, 0);
            });
          },
        });
      },
    },
  });
  return (
    <OpenApiEditorMachineContext.Provider
      logic={editorLogic}
      options={{
        inspect: document.location.host === "localhost" ? inspect : undefined,
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
        <Editor />
      </div>
    </OpenApiEditorMachineContext.Provider>
  );
}

function Editor() {
  const { isSavingSlowly, documentTitle, selectedNode, view, actorRef } =
    OpenApiEditorMachineContext.useSelector(({ context, value }) => ({
      isSavingSlowly: value === "slowSaving",
      documentTitle: context.documentTitle,
      selectedNode: context.selectedNode,
      view: context.view,
      actorRef: context.actorRef,
    }));

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
      />
      <Drawer
        isExpanded={true}
        isInline={true}
        position={"start"}
        className={`apicurio-editor ${classes.editor}`}
      >
        <DrawerContent
          panelContent={
            <DrawerPanelContent
              isResizable={true}
              widths={{ default: "width_75" }}
            >
              {(() => {
                switch (true) {
                  case selectedNode.type === "validation":
                    return <ValidationMessages />;
                  case view === "design":
                  case view === "visualize":
                    switch (selectedNode.type) {
                      case "root":
                        return actorRef ? (
                          <DocumentDesignerProvider
                            value={
                              actorRef as ComponentProps<
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
                        return actorRef ? (
                          <PathDesignerProvider
                            value={
                              actorRef as ComponentProps<
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
                        return actorRef ? (
                          <DataTypeDesignerProvider
                            value={
                              actorRef as ComponentProps<
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
                        return actorRef ? (
                          <ResponseDesignerProvider
                            value={
                              actorRef as ComponentProps<
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
                          actorRef as ComponentProps<
                            typeof CodeEditorProvider
                          >["value"]
                        }
                      >
                        <CodeEditor />
                      </CodeEditorProvider>
                    );
                }
              })()}
            </DrawerPanelContent>
          }
        >
          <EditorSidebar />
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
}
