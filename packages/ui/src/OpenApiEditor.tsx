import {
  Drawer,
  DrawerContent,
  DrawerPanelContent,
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
import { ComponentProps } from "react";
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

const { inspect } = createBrowserInspector();

type OpenApiEditorProps = {
  getEditorState: (filter: string) => Promise<EditorModel>;
  getDocumentRootSnapshot: () => Promise<DocumentRoot>;
  getPathSnapshot: (path: NodePath) => Promise<DocumentPath>;
  getDataTypeSnapshot: (path: NodeDataType) => Promise<DocumentDataType>;
  getResponseSnapshot: (path: NodeResponse) => Promise<DocumentResponse>;
  getNodeSource: (node: SelectedNode) => Promise<Source>;
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
}: OpenApiEditorProps) {
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
      getNodeSource: fromPromise(({ input }) => getNodeSource(input)),
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
  });
  return (
    <OpenApiEditorMachineContext.Provider
      logic={editorLogic}
      options={{
        inspect,
      }}
    >
      <Editor />
    </OpenApiEditorMachineContext.Provider>
  );
}

function Editor() {
  const { selectedNode, view, actorRef } =
    OpenApiEditorMachineContext.useSelector(({ context }) => ({
      selectedNode: context.selectedNode,
      view: context.view,
      actorRef: context.actorRef,
    }));
  return (
    <>
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
                  case view === "designer":
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
    </>
  );
}
