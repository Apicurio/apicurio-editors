import {
  Drawer,
  DrawerContent,
  PageSection,
  Split,
  SplitItem,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { createActorContext } from "@xstate/react";
import { fromPromise } from "xstate";
import { Loading } from "./components";
import { DocumentTitle } from "./components/DocumentTitle.tsx";
import { EditorSidebar } from "./components/EditorSidebar.tsx";
import { UndoRedo } from "./components/UndoRedo.tsx";
import {
  Document,
  DocumentNavigation,
  OpenApiEditorMachine,
} from "./OpenApiEditorMachine.tsx";

type OpenApiEditorProps = {
  getDocumentSnapshot: () => Promise<Document>;
  filterNavigation: (filter: string) => Promise<DocumentNavigation>;
  updateDocumentTitle: (title: string) => Promise<Document>;
  undo: () => Promise<Document>;
  redo: () => Promise<Document>;
};

export const OpenApiEditorMachineContext =
  createActorContext(OpenApiEditorMachine);

export function OpenApiEditor({
  getDocumentSnapshot,
  filterNavigation,
  updateDocumentTitle,
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
          undo: fromPromise(() => undo()),
          redo: fromPromise(() => redo()),
        },
      })}
    >
      <PageSection
        isFilled={true}
        padding={{ default: "noPadding" }}
        className={"pf-v5-u-h-100"}
      >
        <Editor />
      </PageSection>
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
        <Stack className={"pf-v5-u-h-100"}>
          <StackItem>
            <Split>
              <SplitItem isFilled={true}>
                <DocumentTitle />
              </SplitItem>
              <SplitItem>
                <UndoRedo />
              </SplitItem>
            </Split>
          </StackItem>
          <StackItem isFilled={true} style={{ overflow: "auto" }}>
            <Drawer isExpanded={true} isInline={true} position={"start"}>
              <DrawerContent panelContent={<EditorSidebar />}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
                aliquid amet aperiam assumenda consequatur doloremque eos esse,
                facere itaque, odio officiis quos repudiandae sapiente. A
                asperiores enim nulla praesentium rerum.
              </DrawerContent>
            </Drawer>
          </StackItem>
        </Stack>
      );
  }
}
