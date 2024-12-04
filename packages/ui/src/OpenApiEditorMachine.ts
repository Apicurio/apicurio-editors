import {
  ActorRefFrom,
  assign,
  enqueueActions,
  fromPromise,
  raise,
  sendTo,
  setup,
  stopChild,
} from "xstate";
import { EditorModel, Node } from "./OpenApiEditorModels";
import { DocumentDesignerMachine } from "./documentDesigner/DocumentDesignerMachine.ts";
import { CodeEditorMachine } from "./codeEditor/CodeEditorMachine.ts";
import { PathDesignerMachine } from "./pathDesigner/PathDesignerMachine.ts";
import { DataTypeDesignerMachine } from "./dataTypeDesigner/DataTypeDesignerMachine.ts";
import { ResponseDesignerMachine } from "./responseDesigner/ResponseDesignerMachine.ts";
import { EditorToolbarView } from "./components/EditorToolbar.tsx";
import { PathsDesignerMachine } from "./pathsDesigner/PathsDesignerMachine.ts";

type Context = EditorModel & {
  history: (Node | { type: "validation" })[];
  historyPosition: number;
  currentNode: Node | { type: "validation" };
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
      readonly type: "BACK";
    }
  | {
      readonly type: "FORWARD";
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
    undoChange: fromPromise<Node | false>(() =>
      Promise.resolve({ type: "root" }),
    ),
    redoChange: fromPromise<Node | false>(() =>
      Promise.resolve({ type: "root" }),
    ),
    documentRootDesigner: DocumentDesignerMachine,
    pathDesigner: PathDesignerMachine,
    dataTypeDesigner: DataTypeDesignerMachine,
    responseDesigner: ResponseDesignerMachine,
    pathsDesigner: PathsDesignerMachine,
    codeEditor: CodeEditorMachine,
  },
  actions: {
    onDocumentChange: () => {},
    addToHistory: enqueueActions(
      ({ enqueue, context }, params: { node: Node }) => {
        const history = context.history.slice(0, context.historyPosition + 1);
        history.push(params.node);
        const historyPosition = history.length - 1;
        enqueue.assign({
          history,
          historyPosition,
          currentNode: history[historyPosition],
        });
      },
    ),
    goBack: enqueueActions(({ enqueue, context }) => {
      const historyPosition = context.historyPosition - 1;
      enqueue.assign({
        historyPosition,
        currentNode: context.history[historyPosition],
      });
    }),
    goForward: enqueueActions(({ enqueue, context }) => {
      const historyPosition = context.historyPosition + 1;
      enqueue.assign({
        historyPosition,
        currentNode: context.history[historyPosition],
      });
    }),
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
    history: [],
    historyPosition: 0,
    currentNode: { type: "root" },
    view: "design",
  },
  initial: "parsing",
  entry: {
    type: "addToHistory",
    params: {
      node: { type: "root" },
    },
  },
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
          const currentNode = context.currentNode;
          if (currentNode.type === "validation") {
            return undefined;
          }
          switch (context.view) {
            case "design":
              switch (currentNode.type) {
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
                      node: currentNode,
                      editable: context.view === "design",
                    },
                  });
                case "datatype":
                  return spawn("dataTypeDesigner", {
                    input: {
                      parentRef: self,
                      dataType: currentNode,
                      editable: context.view === "design",
                    },
                  });
                case "response":
                  return spawn("responseDesigner", {
                    input: {
                      parentRef: self,
                      response: currentNode,
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
                  node: currentNode,
                  isCloseable: currentNode.type !== "root",
                  title: (() => {
                    switch (currentNode.type) {
                      case "root":
                      case "paths":
                      case "datatypes":
                      case "responses":
                        return context.documentTitle;
                      case "path":
                        return currentNode.path;
                      case "datatype":
                        return currentNode.name;
                      case "response":
                        return currentNode.name;
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
          target: "viewChanged",
          actions: [
            enqueueActions(({ event, enqueue }) => {
              if (event.output !== false) {
                enqueue({
                  type: "addToHistory",
                  params: {
                    node: event.output,
                  },
                });
              }
            }),
            raise({ type: "DOCUMENT_CHANGED" }),
          ],
        },
      },
    },
    redoing: {
      invoke: {
        src: "redoChange",
        onDone: {
          target: "viewChanged",
          actions: [
            enqueueActions(({ event, enqueue }) => {
              if (event.output !== false) {
                enqueue({
                  type: "addToHistory",
                  params: {
                    node: event.output,
                  },
                });
              }
            }),
            raise({ type: "DOCUMENT_CHANGED" }),
          ],
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
      actions: [
        {
          type: "addToHistory",
          params: {
            node: { type: "root" },
          },
        },
        assign({ view: "design" }),
      ],
    },
    SELECT_PATHS_DESIGNER: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: {
            node: { type: "paths" },
          },
        },
        assign({ view: "design" }),
      ],
    },
    SELECT_RESPONSES_DESIGNER: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: {
            node: { type: "responses" },
          },
        },
        assign({ view: "design" }),
      ],
    },
    SELECT_DATATYPES_DESIGNER: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: {
            node: { type: "datatypes" },
          },
        },
        assign({ view: "design" }),
      ],
    },
    SELECT_PATH_DESIGNER: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: ({ event }) => ({
            node: {
              type: "path",
              path: event.path,
              nodePath: event.nodePath,
            },
          }),
        },
        assign({ view: "design" }),
      ],
    },
    SELECT_DATA_TYPE_DESIGNER: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: ({ event }) => ({
            node: {
              type: "datatype",
              name: event.name,
              nodePath: event.nodePath,
            },
          }),
        },
        assign({ view: "design" }),
      ],
    },
    SELECT_RESPONSE_DESIGNER: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: ({ event }) => ({
            node: {
              type: "response",
              name: event.name,
              nodePath: event.nodePath,
            },
          }),
        },
        assign({ view: "design" }),
      ],
    },
    SELECT_DOCUMENT_ROOT_CODE: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: {
            node: { type: "root" },
          },
        },
        assign({ view: "code" }),
      ],
    },
    SELECT_PATHS_CODE: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: {
            node: { type: "paths" },
          },
        },
        assign({ view: "code" }),
      ],
    },
    SELECT_RESPONSES_CODE: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: {
            node: { type: "responses" },
          },
        },
        assign({ view: "code" }),
      ],
    },
    SELECT_DATATYPES_CODE: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: {
            node: { type: "datatypes" },
          },
        },
        assign({ view: "code" }),
      ],
    },
    SELECT_PATH_CODE: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: ({ event }) => ({
            node: {
              type: "path",
              path: event.path,
              nodePath: event.nodePath,
            },
          }),
        },
        assign({ view: "code" }),
      ],
    },
    SELECT_DATA_TYPE_CODE: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: ({ event }) => ({
            node: {
              type: "datatype",
              name: event.name,
              nodePath: event.nodePath,
            },
          }),
        },
        assign({ view: "code" }),
      ],
    },
    SELECT_RESPONSE_CODE: {
      target: ".viewChanged",
      actions: [
        {
          type: "addToHistory",
          params: ({ event }) => ({
            node: {
              type: "response",
              name: event.name,
              nodePath: event.nodePath,
            },
          }),
        },
        assign({ view: "code" }),
      ],
    },
    SELECT_VALIDATION: {
      actions: {
        type: "addToHistory",
        params: {
          node: { type: "root" },
        },
      },
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
    BACK: {
      target: ".viewChanged",
      guard: ({ context }) => context.historyPosition > 0,
      actions: "goBack",
    },
    FORWARD: {
      target: ".viewChanged",
      guard: ({ context }) =>
        context.historyPosition < context.history.length - 1,
      actions: "goForward",
    },
    START_SAVING: ".saving",
    END_SAVING: ".idle",
    NEW_SPEC: ".parsing",
  },
});
