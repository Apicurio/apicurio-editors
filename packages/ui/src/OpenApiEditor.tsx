import {
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
} from "@patternfly/react-core";
import { createActorContext } from "@xstate/react";
import { fromPromise } from "xstate";
import { DocumentRoot } from "./components/DocumentRoot.tsx";
import { EditorSidebar } from "./components/EditorSidebar";
import { Loading } from "./components/Loading.tsx";
import { OpenApiEditorMachine } from "./OpenApiEditorMachine.ts";
import { DocumentNavigation, EditorModel } from "./OpenApiEditorModels.ts";
import classes from "./OpenApiEditor.module.css";

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
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  switch (true) {
    case state.matches("loading"):
      return <Loading />;
    default:
      return (
        <>
          <Drawer isExpanded={true} isInline={true} position={"start"}>
            <DrawerContent
              panelContent={
                <DrawerPanelContent
                  isResizable={true}
                  minSize={"250px"}
                  widths={{ default: "width_75" }}
                  className={`apicurio-editor ${classes.editor}`}
                >
                  {state.context.selectedNode && (
                    <DrawerHead>
                      <span>Drawer panel header</span>
                      <DrawerActions>
                        <DrawerCloseButton
                          onClick={() =>
                            actorRef.send({ type: "DESELECT_NODE" })
                          }
                        />
                      </DrawerActions>
                    </DrawerHead>
                  )}
                  <DrawerPanelBody hasNoPadding={true}>
                    {(() => {
                      switch (state.context.selectedNode?.type) {
                        case "path":
                          return "path";
                        case "datatype":
                          return "datatype";
                        case "response":
                          return "response";
                        default:
                          return <DocumentRoot />;
                      }
                    })()}
                  </DrawerPanelBody>
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
