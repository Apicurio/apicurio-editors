import {
  Drawer,
  DrawerContent,
  PageSection,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { createActorContext } from "@xstate/react";
import { fromPromise } from "xstate";
import { DocumentRoot } from "./components/DocumentRoot.tsx";
import { EditorSidebar } from "./components/EditorSidebar";
import { Header } from "./components/Header.tsx";
import { Loading } from "./components/Loading.tsx";
import { UndoRedo } from "./components/UndoRedo";
import { OpenApiEditorMachine } from "./OpenApiEditorMachine.ts";
import { DocumentNavigation, EditorModel } from "./OpenApiEditorModels.ts";

type OpenApiEditorProps = {
  getDocumentSnapshot: () => Promise<EditorModel>;
  filterNavigation: (filter: string) => Promise<DocumentNavigation>;
  updateDocumentTitle: (title: string) => Promise<EditorModel>;
  updateDocumentVersion: (version: string) => Promise<EditorModel>;
  updateDocumentDescription: (description: string) => Promise<EditorModel>;
  updateDocumentContactName: (contactName: string) => Promise<EditorModel>;
  updateDocumentContactEmail: (contactEmail: string) => Promise<EditorModel>;
  updateDocumentContactUrl: (contactUrl: string) => Promise<EditorModel>;
  undo: () => Promise<EditorModel>;
  redo: () => Promise<EditorModel>;
};

export const OpenApiEditorMachineContext =
  createActorContext(OpenApiEditorMachine);

export function OpenApiEditor({
  getDocumentSnapshot,
  filterNavigation,
  updateDocumentTitle,
  updateDocumentVersion,
  updateDocumentDescription,
  updateDocumentContactName,
  updateDocumentContactEmail,
  updateDocumentContactUrl,
  undo,
  redo,
}: OpenApiEditorProps) {
  return (
    <OpenApiEditorMachineContext.Provider
      logic={OpenApiEditorMachine.provide({
        actors: {
          getDocumentSnapshot: fromPromise(() => getDocumentSnapshot()),
          filterNavigation: fromPromise(({ input }) => filterNavigation(input)),
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
          undo: fromPromise(() => undo()),
          redo: fromPromise(() => redo()),
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
          <PageSection>
            <Split>
              <SplitItem isFilled={true}>
                <Header />
              </SplitItem>
              <SplitItem>
                <UndoRedo />
              </SplitItem>
            </Split>
          </PageSection>
          <Drawer isExpanded={true} isInline={true} position={"start"}>
            <DrawerContent panelContent={<EditorSidebar />}>
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
            </DrawerContent>
          </Drawer>
        </>
      );
  }
}
