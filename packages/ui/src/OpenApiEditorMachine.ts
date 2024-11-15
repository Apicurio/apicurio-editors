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

type Context = EditorModel & {
  navigationFilter: string;
  selectedNode: SelectedNode | { type: "validation" };
  view: "designer" | "code";
  actorRef?:
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
      readonly type: "FILTER";
      readonly filter: string;
    }
  | {
      readonly type: "SELECT_DOCUMENT_ROOT_DESIGNER";
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
    view: "designer",
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
        actorRef: ({ context, spawn, self }) => {
          if (context.actorRef) {
            stopChild(context.actorRef);
          }
          if (context.selectedNode.type === "validation") {
            return undefined;
          }
          switch (context.view) {
            case "designer":
              switch (context.selectedNode.type) {
                case "root":
                  return spawn("documentRootDesigner", {
                    input: {
                      parentRef: self,
                    },
                  });
                case "path":
                  return spawn("pathDesigner", {
                    input: {
                      parentRef: self,
                      path: context.selectedNode,
                    },
                  });
                case "datatype":
                  return spawn("dataTypeDesigner", {
                    input: {
                      parentRef: self,
                      dataType: context.selectedNode,
                    },
                  });
                case "response":
                  return spawn("responseDesigner", {
                    input: {
                      parentRef: self,
                      response: context.selectedNode,
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
            sendTo(({ context }) => context.actorRef!, {
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
    SELECT_DOCUMENT_ROOT_DESIGNER: {
      target: ".viewChanged",
      actions: assign({
        selectedNode: { type: "root" },
        view: "designer",
      }),
    },
    SELECT_PATH_DESIGNER: {
      target: ".viewChanged",
      actions: assign(({ event }) => ({
        selectedNode: {
          type: "path",
          path: event.path,
          nodePath: event.nodePath,
        },
        view: "designer",
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
        view: "designer",
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
        view: "designer",
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
        view: "code",
      }),
    },
    GO_TO_CODE_VIEW: {
      target: ".viewChanged",
      actions: assign({
        view: "designer",
      }),
    },
    UNDO: ".undoing",
    REDO: ".redoing",
    START_SAVING: ".saving",
    END_SAVING: ".idle",
  },
});
