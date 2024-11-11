import {
  Drawer,
  DrawerContent,
  DrawerPanelContent,
} from "@patternfly/react-core";
import { createActorContext } from "@xstate/react";
import { fromPromise } from "xstate";
import { DocumentRootDesigner } from "./components/DocumentRootDesigner.tsx";
import { EditorSidebar } from "./components/EditorSidebar";
import { OpenApiEditorMachine } from "./OpenApiEditorMachine.ts";
import {
  DocumentNavigation,
  EditorModel,
  SelectedNodeType,
} from "./OpenApiEditorModels.ts";
import classes from "./OpenApiEditor.module.css";
import { ValidationMessages } from "./components/ValidationMessages.tsx";
import { PathDesigner } from "./components/PathDesigner.tsx";
import { DataTypeDesigner } from "./components/DataTypeDesigner.tsx";
import { ResponseDesigner } from "./components/ResponseDesigner.tsx";
import { NodeCode } from "./components/NodeCode.tsx";
import { DocumentRootDesignerSkeleton } from "./components/DocumentRootDesignerSkeleton.tsx";
import { NodeCodeSkeleton } from "./components/NodeCodeSkeleton.tsx";

type OpenApiEditorProps = {
  getNodeSnapshot: (node: SelectedNodeType) => Promise<EditorModel>;
  getNodeSource: (
    node: SelectedNodeType
  ) => Promise<EditorModel & { source: object }>;
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
  getNodeSnapshot,
  getNodeSource,
  getDocumentNavigation,
  updateDocumentTitle,
  updateDocumentVersion,
  updateDocumentDescription,
  updateDocumentContactName,
  updateDocumentContactEmail,
  updateDocumentContactUrl,
  undoChange,
  redoChange,
}: OpenApiEditorProps) {
  return (
    <OpenApiEditorMachineContext.Provider
      logic={OpenApiEditorMachine.provide({
        actors: {
          getNodeSnapshot: fromPromise(({ input }) => getNodeSnapshot(input)),
          getNodeSource: fromPromise(({ input }) => getNodeSource(input)),
          getDocumentNavigation: fromPromise(({ input }) =>
            getDocumentNavigation(input)
          ),
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
          undoChange: fromPromise(() => undoChange()),
          redoChange: fromPromise(() => redoChange()),
        },
      })}
    >
      <Editor />
    </OpenApiEditorMachineContext.Provider>
  );
}

function Editor() {
  const state = OpenApiEditorMachineContext.useSelector((state) => state);
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
                  case state.matches({
                    selectedNode: { path: "designer" },
                  }):
                    return <PathDesigner />;
                  case state.matches({
                    selectedNode: { dataType: "designer" },
                  }):
                    return <DataTypeDesigner />;
                  case state.matches({
                    selectedNode: { response: "designer" },
                  }):
                    return <ResponseDesigner />;
                  case state.matches({
                    selectedNode: "validation",
                  }):
                    return <ValidationMessages />;
                  case state.matches({
                    selectedNode: {
                      documentRoot: {
                        designer: "loading",
                      },
                    },
                  }):
                    return <DocumentRootDesignerSkeleton />;
                  case state.matches({
                    selectedNode: {
                      documentRoot: "designer",
                    },
                  }): // match all states in the designer section other than the loading one (catches the updates as well)
                    return <DocumentRootDesigner />;

                  // all code editors are the same
                  case state.matches({
                    selectedNode: {
                      documentRoot: {
                        code: "loading",
                      },
                    },
                  }):
                  case state.matches({
                    selectedNode: {
                      path: {
                        code: "loading",
                      },
                    },
                  }):
                  case state.matches({
                    selectedNode: {
                      dataType: {
                        code: "loading",
                      },
                    },
                  }):
                  case state.matches({
                    selectedNode: {
                      response: {
                        code: "loading",
                      },
                    },
                  }):
                    return <NodeCodeSkeleton />;
                  case state.matches({
                    selectedNode: { documentRoot: "code" },
                  }):
                  case state.matches({
                    selectedNode: { path: "code" },
                  }):
                  case state.matches({
                    selectedNode: { dataType: "code" },
                  }):
                  case state.matches({
                    selectedNode: { response: "code" },
                  }):
                    return <NodeCode />;
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
