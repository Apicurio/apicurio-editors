import {
  ActorRefFrom,
  assign,
  fromPromise,
  raise,
  sendTo,
  setup,
  stopChild,
} from "xstate";
import { EditorModel, SelectedNode } from "./OpenApiEditorModels";
import { DocumentDesignerMachine } from "./documentDesigner/DocumentDesignerMachine.ts";
import { CodeEditorMachine } from "./codeEditor/CodeEditorMachine.ts";
import { PathDesignerMachine } from "./pathDesigner/PathDesignerMachine.ts";
import { DataTypeDesignerMachine } from "./dataTypeDesigner/DataTypeDesignerMachine.ts";
import { ResponseDesignerMachine } from "./responseDesigner/ResponseDesignerMachine.ts";
import { EditorToolbarView } from "./components/EditorToolbar.tsx";
import { PathsDesignerMachine } from "./pathsDesigner/PathsDesignerMachine.ts";

type Context = EditorModel & {
  selectedNode: SelectedNode | { type: "validation" };
  view: Exclude<EditorToolbarView, "hidden">;
  spawnedMachineRef?:
    | ActorRefFrom<typeof DocumentDesignerMachine>
    | ActorRefFrom<typeof PathDesignerMachine>
    | ActorRefFrom<typeof DataTypeDesignerMachine>
    | ActorRefFrom<typeof ResponseDesignerMachine>
    | ActorRefFrom<typeof PathsDesignerMachine>
    | ActorRefFrom<typeof CodeEditorMachine>;
};

type Events =
  | {
      readonly type: "xstate.init";
      readonly input: {
        readonly spec: string;
      };
    }
  | {
      readonly type: "NEW_SPEC";
      readonly spec: string;
    }
  | {
      readonly type: "SELECT_DOCUMENT_ROOT_DESIGNER";
    }
  | {
      readonly type: "SELECT_DOCUMENT_ROOT_CODE";
    }
  | {
      readonly type: "SELECT_PATHS_DESIGNER";
    }
  | {
      readonly type: "SELECT_PATHS_CODE";
    }
  | {
      readonly type: "SELECT_RESPONSES_DESIGNER";
    }
  | {
      readonly type: "SELECT_RESPONSES_CODE";
    }
  | {
      readonly type: "SELECT_DATATYPES_DESIGNER";
    }
  | {
      readonly type: "SELECT_DATATYPES_CODE";
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
    input: {
      spec: "" as string,
    },
  },
  actors: {
    parseOpenApi: fromPromise<void, string>(() => Promise.resolve()),
    getEditorState: fromPromise<EditorModel>(() =>
      Promise.resolve({} as EditorModel),
    ),
    undoChange: fromPromise<void, void>(() => Promise.resolve()),
    redoChange: fromPromise<void, void>(() => Promise.resolve()),
    documentRootDesigner: DocumentDesignerMachine,
    pathDesigner: PathDesignerMachine,
    dataTypeDesigner: DataTypeDesignerMachine,
    responseDesigner: ResponseDesignerMachine,
    pathsDesigner: PathsDesignerMachine,
    codeEditor: CodeEditorMachine,
  },
  actions: {
    onDocumentChange: () => {},
  },
}).createMachine({
  id: "openApiEditor",
  context: {
    documentTitle: "",
    canUndo: false,
    canRedo: false,
    navigation: {
      paths: [],
      responses: [],
      dataTypes: [],
    },
    selectedNode: {
      type: "root",
    },
    view: "design",
  },
  initial: "parsing",
  states: {
    parsing: {
      invoke: {
        src: "parseOpenApi",
        input: ({ event }) => {
          console.log("parseOpenApi actor", event);
          if (event.type === "xstate.init" && event.input.spec) {
            return event.input.spec;
          }
          if (event.type === "NEW_SPEC") {
            return event.spec;
          }
          throw new Error("Invalid event type");
        },
        onDone: "viewChanged",
        onError: "error",
      },
    },
    error: {},
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
              switch (context.selectedNode.type) {
                case "root":
                  return spawn("documentRootDesigner", {
                    input: {
                      parentRef: self,
                      editable: context.view === "design",
                    },
                  });
                case "paths":
                  return spawn("pathsDesigner", {
                    input: {
                      parentRef: self,
                    },
                  });
                case "path":
                  return spawn("pathDesigner", {
                    input: {
                      parentRef: self,
                      node: context.selectedNode,
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
                      case "paths":
                      case "datatypes":
                      case "responses":
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
        onDone: {
          target: "idle",
          actions: [assign(({ event }) => event.output)],
        },
      },
    },
    documentChanged: {
      invoke: {
        src: "getEditorState",
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
  },
  on: {
    DOCUMENT_CHANGED: {
      target: ".documentChanged",
    },
    SELECT_DOCUMENT_ROOT_DESIGNER: {
      target: ".viewChanged",
      actions: assign({
        selectedNode: { type: "root" },
        view: "design",
      }),
    },
    SELECT_PATHS_DESIGNER: {
      target: ".viewChanged",
      actions: assign({
        selectedNode: { type: "paths" },
        view: "design",
      }),
    },
    SELECT_RESPONSES_DESIGNER: {
      target: ".viewChanged",
      actions: assign({
        selectedNode: { type: "responses" },
        view: "design",
      }),
    },
    SELECT_DATATYPES_DESIGNER: {
      target: ".viewChanged",
      actions: assign({
        selectedNode: { type: "datatypes" },
        view: "design",
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
    SELECT_PATHS_CODE: {
      target: ".viewChanged",
      actions: assign({
        selectedNode: { type: "paths" },
        view: "code",
      }),
    },
    SELECT_RESPONSES_CODE: {
      target: ".viewChanged",
      actions: assign({
        selectedNode: { type: "responses" },
        view: "code",
      }),
    },
    SELECT_DATATYPES_CODE: {
      target: ".viewChanged",
      actions: assign({
        selectedNode: { type: "datatypes" },
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
    UNDO: ".undoing",
    REDO: ".redoing",
    START_SAVING: ".saving",
    END_SAVING: ".idle",
    NEW_SPEC: ".parsing",
  },
});
