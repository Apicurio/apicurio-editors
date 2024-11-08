import {
  Drawer,
  DrawerContent,
  DrawerPanelContent,
} from "@patternfly/react-core";
import { createActorContext } from "@xstate/react";
import { fromPromise } from "xstate";
import { DocumentRootDesigner } from "./components/DocumentRootDesigner.tsx";
import { EditorSidebar } from "./components/EditorSidebar";
import { Loading } from "./components/Loading.tsx";
import { OpenApiEditorMachine } from "./OpenApiEditorMachine.ts";
import { DocumentNavigation, EditorModel } from "./OpenApiEditorModels.ts";
import classes from "./OpenApiEditor.module.css";
import { ValidationMessages } from "./components/ValidationMessages.tsx";
import { PathDesigner } from "./components/PathDesigner.tsx";
import { DataTypeDesigner } from "./components/DataTypeDesigner.tsx";
import { ResponseDesigner } from "./components/ResponseDesigner.tsx";
import { DocumentRootEditor } from "./components/DocumentRootEditor.tsx";

type OpenApiEditorProps = {
  getDocumentSnapshot: () => Promise<EditorModel>;
  getDocumentNavigation: (filter: string) => Promise<DocumentNavigation>;
  updateDocumentTitle: (title: string) => Promise<EditorModel>;
  updateDocumentVersion: (version: string) => Promise<EditorModel>;
  updateDocumentDescription: (description: string) => Promise<EditorModel>;
  updateDocumentContactName: (contactName: string) => Promise<EditorModel>;
  updateDocumentContactEmail: (contactEmail: string) => Promise<EditorModel>;
  updateDocumentContactUrl: (contactUrl: string) => Promise<EditorModel>;
  undoChange: () => Promise<EditorModel>;
  redoChange: () => Promise<EditorModel>;
};

export const OpenApiEditorMachineContext =
  createActorContext(OpenApiEditorMachine);

export function OpenApiEditor({
  getDocumentSnapshot,
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
          getDocumentSnapshot: fromPromise(() => getDocumentSnapshot()),
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
  switch (true) {
    case state.matches("loading"):
      return <Loading />;
    default:
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
                        ready: { selectedNode: { path: "designer" } },
                      }):
                        return <PathDesigner />;
                      case state.matches({
                        ready: { selectedNode: { dataType: "designer" } },
                      }):
                        return <DataTypeDesigner />;
                      case state.matches({
                        ready: { selectedNode: { response: "designer" } },
                      }):
                        return <ResponseDesigner />;
                      case state.matches({
                        ready: { selectedNode: "validation" },
                      }):
                        return <ValidationMessages />;
                      case state.matches({
                        ready: { selectedNode: { documentRoot: "designer" } },
                      }):
                        return <DocumentRootDesigner />;
                      case state.matches({
                        ready: { selectedNode: { documentRoot: "yaml" } },
                      }):
                        return <DocumentRootEditor />;
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
}
