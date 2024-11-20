import {
  ActorRefFrom,
  assign,
  fromPromise,
  raise,
  sendTo,
  setup,
  stopChild,
} from "xstate";
import {
  DocumentNavigation,
  EditorModel,
  SelectedNode,
} from "./OpenApiEditorModels";
import { DocumentDesignerMachine } from "./documentDesigner/DocumentDesignerMachine.ts";
import { CodeEditorMachine } from "./codeEditor/CodeEditorMachine.ts";
import { PathDesignerMachine } from "./pathDesigner/PathDesignerMachine.ts";
import { DataTypeDesignerMachine } from "./dataTypeDesigner/DataTypeDesignerMachine.ts";
import { ResponseDesignerMachine } from "./responseDesigner/ResponseDesignerMachine.ts";
import { EditorToolbarView } from "./components/EditorToolbar.tsx";

type Context = EditorModel & {
  navigationFilter: string;
  selectedNode: SelectedNode | { type: "validation" };
  view: Exclude<EditorToolbarView, "hidden">;
  showNavigation: boolean;
  spawnedMachineRef?:
    | ActorRefFrom<typeof DocumentDesignerMachine>
    | ActorRefFrom<typeof PathDesignerMachine>
    | ActorRefFrom<typeof DataTypeDesignerMachine>
    | ActorRefFrom<typeof ResponseDesignerMachine>
    | ActorRefFrom<typeof CodeEditorMachine>;
};

type Events =
  | {
      readonly type: "xstate.init";
    }
  | {
      readonly type: "SHOW_NAVIGATION";
    }
  | {
      readonly type: "HIDE_NAVIGATION";
    }
  | {
      readonly type: "FILTER";
      readonly filter: string;
    }
  | {
      readonly type: "SELECT_DOCUMENT_ROOT_DESIGNER";
    }
  | {
      readonly type: "SELECT_PATH_VISUALIZER";
      readonly path: string;
      readonly nodePath: string;
    }
  | {
      readonly type: "SELECT_DATA_TYPE_VISUALIZER";
      readonly name: string;
      readonly nodePath: string;
    }
  | {
      readonly type: "SELECT_RESPONSE_VISUALIZER";
      readonly name: string;
      readonly nodePath: string;
    }
  | {
      readonly type: "SELECT_PATH_DESIGNER";
      readonly path: string;
      readonly nodePath: string;
    }
  | {
      readonly type: "SELECT_DATA_TYPE_DESIGNER";
      readonly name: string;
      readonly nodePath: string;
    }
  | {
      readonly type: "SELECT_RESPONSE_DESIGNER";
      readonly name: string;
      readonly nodePath: string;
    }
  | {
      readonly type: "SELECT_DOCUMENT_ROOT_VISUALIZER";
    }
  | {
      readonly type: "SELECT_DOCUMENT_ROOT_CODE";
    }
  | {
      readonly type: "SELECT_PATH_CODE";
      readonly path: string;
      readonly nodePath: string;
    }
  | {
      readonly type: "SELECT_DATA_TYPE_CODE";
      readonly name: string;
      readonly nodePath: string;
    }
  | {
      readonly type: "SELECT_RESPONSE_CODE";
      readonly name: string;
      readonly nodePath: string;
    }
  | {
      readonly type: "SELECT_VALIDATION";
    }
  | {
      readonly type: "CHANGE_TITLE";
      readonly title: string;
    }
  | {
      readonly type: "CHANGE_VERSION";
      readonly version: string;
    }
  | {
      readonly type: "CHANGE_DESCRIPTION";
      readonly description: string;
    }
  | {
      readonly type: "CHANGE_CONTACT_NAME";
      readonly contactName: string;
    }
  | {
      readonly type: "CHANGE_CONTACT_EMAIL";
      readonly contactEmail: string;
    }
  | {
      readonly type: "CHANGE_CONTACT_URL";
      readonly contactUrl: string;
    }
  | {
      readonly type: "UNDO";
    }
  | {
      readonly type: "REDO";
    }
  | {
      readonly type: "GO_TO_VISUALIZER_VIEW";
    }
  | {
      readonly type: "GO_TO_DESIGNER_VIEW";
    }
  | {
      readonly type: "GO_TO_CODE_VIEW";
    }
  | {
      readonly type: "DOCUMENT_CHANGED";
    }
  | {
      readonly type: "START_SAVING";
    }
  | {
      readonly type: "END_SAVING";
    };

export const OpenApiEditorMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
  actors: {
    getEditorState: fromPromise<EditorModel, string>(() =>
      Promise.resolve({} as EditorModel)
    ),
    getDocumentNavigation: fromPromise<DocumentNavigation, string>(() =>
      Promise.resolve({} as DocumentNavigation)
    ),
    undoChange: fromPromise<void, void>(() => Promise.resolve()),
    redoChange: fromPromise<void, void>(() => Promise.resolve()),
    documentRootDesigner: DocumentDesignerMachine,
    pathDesigner: PathDesignerMachine,
    dataTypeDesigner: DataTypeDesignerMachine,
    responseDesigner: ResponseDesignerMachine,
    codeEditor: CodeEditorMachine,
  },
  actions: {
    onDocumentChange: () => {},
  },
}).createMachine({
  id: "openApiEditor",
  context: {
    documentTitle: "",
    navigation: {
      dataTypes: [],
      paths: [],
      responses: [],
    },
    navigationFilter: "",
    canUndo: false,
    canRedo: false,
    validationProblems: [],
    selectedNode: {
      type: "root",
    },
    view: "visualize",
    showNavigation: false,
  },
  initial: "viewChanged",
  states: {
    idle: {},
    saving: {
      after: {
        300: "slowSaving",
      },
    },
    slowSaving: {},
    viewChanged: {
      always: "updateEditorState",
      entry: assign({
        spawnedMachineRef: ({ context, spawn, self }) => {
          if (context.spawnedMachineRef) {
            stopChild(context.spawnedMachineRef);
          }
          if (context.selectedNode.type === "validation") {
            return undefined;
          }
          switch (context.view) {
            case "design":
            case "visualize":
              switch (context.selectedNode.type) {
                case "root":
                  console.log("SPAWN", context.view);
                  return spawn("documentRootDesigner", {
                    input: {
                      parentRef: self,
                      editable: context.view === "design",
                    },
                  });
                case "path":
                  return spawn("pathDesigner", {
                    input: {
                      parentRef: self,
                      path: context.selectedNode,
                      editable: context.view === "design",
                    },
                  });
                case "datatype":
                  return spawn("dataTypeDesigner", {
                    input: {
                      parentRef: self,
                      dataType: context.selectedNode,
                      editable: context.view === "design",
                    },
                  });
                case "response":
                  return spawn("responseDesigner", {
                    input: {
                      parentRef: self,
                      response: context.selectedNode,
                      editable: context.view === "design",
                    },
                  });
              }
              break;
            case "code":
              return spawn("codeEditor", {
                input: {
                  type: "yaml",
                  parentRef: self,
                  selectedNode: context.selectedNode,
                  isCloseable: context.selectedNode.type !== "root",
                  title: (() => {
                    switch (context.selectedNode.type) {
                      case "root":
                        return context.documentTitle;
                      case "path":
                        return context.selectedNode.path;
                      case "datatype":
                        return context.selectedNode.name;
                      case "response":
                        return context.selectedNode.name;
                    }
                  })(),
                },
              });
          }
        },
      }),
    },
    updateEditorState: {
      invoke: {
        src: "getEditorState",
        input: ({ context }) => context.navigationFilter,
        onDone: {
          target: "idle",
          actions: [assign(({ event }) => event.output)],
        },
      },
    },
    documentChanged: {
      invoke: {
        src: "getEditorState",
        input: ({ context }) => context.navigationFilter,
        onDone: {
          target: "idle",
          actions: [
            "onDocumentChange",
            assign(({ event }) => event.output),
            sendTo(({ context }) => context.spawnedMachineRef!, {
              type: "DOCUMENT_CHANGED",
            }),
          ],
        },
      },
    },
    undoing: {
      invoke: {
        src: "undoChange",
        onDone: {
          actions: raise({ type: "DOCUMENT_CHANGED" }),
        },
      },
    },
    redoing: {
      invoke: {
        src: "redoChange",
        onDone: {
          actions: raise({ type: "DOCUMENT_CHANGED" }),
        },
      },
    },
    debouncing: {
      on: {
        FILTER: {
          target: ".",
          reenter: true,
          actions: assign({
            navigationFilter: ({ event }) => event.filter,
          }),
        },
      },
      after: {
        200: {
          target: "filtering",
        },
      },
    },
    filtering: {
      on: {
        FILTER: {
          target: ".",
          reenter: true,
          actions: assign({
            navigationFilter: ({ event }) => event.filter,
          }),
        },
      },
      invoke: {
        src: "getDocumentNavigation",
        input: ({ context }) => context.navigationFilter,
        onDone: {
          target: "idle",
          actions: assign({
            navigation: ({ event }) => event.output,
          }),
        },
      },
    },
  },
  on: {
    DOCUMENT_CHANGED: {
      target: ".documentChanged",
    },
    FILTER: {
      target: ".debouncing",
      actions: assign({ navigationFilter: ({ event }) => event.filter }),
    },
    SELECT_DOCUMENT_ROOT_VISUALIZER: {
      target: ".viewChanged",
      actions: assign({
        selectedNode: { type: "root" },
        view: "visualize",
      }),
    },
    SELECT_DOCUMENT_ROOT_DESIGNER: {
      target: ".viewChanged",
      actions: assign({
        selectedNode: { type: "root" },
        view: "design",
      }),
    },
    SELECT_PATH_VISUALIZER: {
      target: ".viewChanged",
      actions: assign(({ event }) => ({
        selectedNode: {
          type: "path",
          path: event.path,
          nodePath: event.nodePath,
        },
        view: "visualize",
      })),
    },
    SELECT_DATA_TYPE_VISUALIZER: {
      target: ".viewChanged",
      actions: assign(({ event }) => ({
        selectedNode: {
          type: "datatype",
          name: event.name,
          nodePath: event.nodePath,
        },
        view: "visualize",
      })),
    },
    SELECT_RESPONSE_VISUALIZER: {
      target: ".viewChanged",
      actions: assign(({ event }) => ({
        selectedNode: {
          type: "response",
          name: event.name,
          nodePath: event.nodePath,
        },
        view: "visualize",
      })),
    },
    SELECT_PATH_DESIGNER: {
      target: ".viewChanged",
      actions: assign(({ event }) => ({
        selectedNode: {
          type: "path",
          path: event.path,
          nodePath: event.nodePath,
        },
        view: "design",
      })),
    },
    SELECT_DATA_TYPE_DESIGNER: {
      target: ".viewChanged",
      actions: assign(({ event }) => ({
        selectedNode: {
          type: "datatype",
          name: event.name,
          nodePath: event.nodePath,
        },
        view: "design",
      })),
    },
    SELECT_RESPONSE_DESIGNER: {
      target: ".viewChanged",
      actions: assign(({ event }) => ({
        selectedNode: {
          type: "response",
          name: event.name,
          nodePath: event.nodePath,
        },
        view: "design",
      })),
    },
    SELECT_DOCUMENT_ROOT_CODE: {
      target: ".viewChanged",
      actions: assign({
        selectedNode: { type: "root" },
        view: "code",
      }),
    },
    SELECT_PATH_CODE: {
      target: ".viewChanged",
      actions: assign(({ event }) => ({
        selectedNode: {
          type: "path",
          path: event.path,
          nodePath: event.nodePath,
        },
        view: "code",
      })),
    },
    SELECT_DATA_TYPE_CODE: {
      target: ".viewChanged",
      actions: assign(({ event }) => ({
        selectedNode: {
          type: "datatype",
          name: event.name,
          nodePath: event.nodePath,
        },
        view: "code",
      })),
    },
    SELECT_RESPONSE_CODE: {
      target: ".viewChanged",
      actions: assign(({ event }) => ({
        selectedNode: {
          type: "response",
          name: event.name,
          nodePath: event.nodePath,
        },
        view: "code",
      })),
    },
    SELECT_VALIDATION: {
      actions: assign({
        selectedNode: { type: "validation" },
      }),
    },
    GO_TO_DESIGNER_VIEW: {
      target: ".viewChanged",
      actions: assign({
        view: "design",
      }),
    },
    GO_TO_CODE_VIEW: {
      target: ".viewChanged",
      actions: assign({
        view: "code",
      }),
    },
    GO_TO_VISUALIZER_VIEW: {
      target: ".viewChanged",
      actions: assign({
        view: "visualize",
      }),
    },
    UNDO: ".undoing",
    REDO: ".redoing",
    START_SAVING: ".saving",
    END_SAVING: ".idle",
    SHOW_NAVIGATION: {
      actions: assign({
        showNavigation: true,
      }),
    },
    HIDE_NAVIGATION: {
      actions: assign({
        showNavigation: false,
      }),
    },
  },
});
