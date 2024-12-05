import { assign, enqueueActions, fromPromise, raise, setup } from "xstate";
import { EditorModel, Node } from "./OpenApiEditorModels";
import { OverviewMachine } from "./OpenApi/overview/OverviewMachine.ts";
import { CodeEditorMachine } from "./OpenApi/code/CodeEditorMachine.ts";
import { PathMachine } from "./OpenApi/path/PathMachine.ts";
import { DataTypeDesignerMachine } from "./OpenApi/dataType/DataTypeDesignerMachine.ts";
import { ResponseDesignerMachine } from "./OpenApi/response/ResponseDesignerMachine.ts";
import { PathsMachine } from "./OpenApi/paths/PathsMachine.ts";

type Context = EditorModel & {
  history: Node[];
  historyPosition: number;
  currentNode: Node;
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
      readonly type: "PARSED";
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
      readonly type: "SELECT_DATA_TYPES_DESIGNER";
    }
  | {
      readonly type: "SELECT_DATA_TYPES_CODE";
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
    overviewDesigner: OverviewMachine,
    pathDesigner: PathMachine,
    dataTypeDesigner: DataTypeDesignerMachine,
    responseDesigner: ResponseDesignerMachine,
    pathsDesigner: PathsMachine,
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
  },
  entry: {
    type: "addToHistory",
    params: {
      node: { type: "root" },
    },
  },
  type: "parallel",
  states: {
    view: {
      initial: "loading",
      states: {
        loading: {
          on: {
            PARSED: "overview",
          },
        },
        code: {
          invoke: {
            src: "codeEditor",
            systemId: "code",
            input: ({ context }) => ({
              type: "yaml",
              node: context.currentNode,
              isCloseable: context.currentNode.type !== "root",
              title: (() => {
                switch (context.currentNode.type) {
                  case "root":
                  case "paths":
                  case "datatypes":
                  case "responses":
                    return context.documentTitle;
                  case "path":
                    return context.currentNode.path;
                  case "datatype":
                    return context.currentNode.name;
                  case "response":
                    return context.currentNode.name;
                }
              })(),
            }),
          },
        },
        validation: {},
        overview: {
          invoke: {
            src: "overviewDesigner",
            systemId: "overview",
          },
        },
        paths: {
          invoke: {
            src: "pathsDesigner",
            systemId: "paths",
          },
        },
        responses: {
          // invoke: {
          //   src: "responsesDesigner",
          // },
        },
        dataTypes: {
          // invoke: {
          //   src: "dataTypesDesigner",
          // },
        },
        path: {
          invoke: {
            src: "pathDesigner",
            systemId: "path",
            input: ({ context }) => {
              if (context.currentNode.type === "path") {
                return { node: context.currentNode };
              }
              throw new Error("Unexpected currentNode");
            },
          },
        },
        dataType: {
          invoke: {
            src: "dataTypeDesigner",
            systemId: "dataType",
            input: ({ context }) => {
              if (context.currentNode.type === "datatype") {
                return { node: context.currentNode };
              }
              throw new Error("Unexpected currentNode");
            },
          },
        },
        response: {
          invoke: {
            src: "responseDesigner",
            systemId: "response",
            input: ({ context }) => {
              if (context.currentNode.type === "response") {
                return { node: context.currentNode };
              }
              throw new Error("Unexpected currentNode");
            },
          },
        },
      },
      on: {
        NEW_SPEC: ".loading",
      },
    },
    editor: {
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
            onDone: {
              target: "viewChanged",
              actions: raise({ type: "PARSED" }),
            },
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
                    switch (event.output.type) {
                      case "root":
                        enqueue.raise({
                          type: "SELECT_DOCUMENT_ROOT_DESIGNER",
                        });
                        break;
                      case "paths":
                        enqueue.raise({
                          type: "SELECT_PATHS_DESIGNER",
                        });
                        break;
                      case "path":
                        enqueue.raise({
                          type: "SELECT_PATH_DESIGNER",
                          path: event.output.path,
                          nodePath: event.output.nodePath,
                        });
                        break;
                      case "datatypes":
                        enqueue.raise({
                          type: "SELECT_DATA_TYPES_DESIGNER",
                        });
                        break;
                      case "datatype":
                        enqueue.raise({
                          type: "SELECT_DATA_TYPE_DESIGNER",
                          name: event.output.name,
                          nodePath: event.output.nodePath,
                        });
                        break;
                      case "responses":
                        enqueue.raise({
                          type: "SELECT_RESPONSES_DESIGNER",
                        });
                        break;
                      case "response":
                        enqueue.raise({
                          type: "SELECT_RESPONSE_DESIGNER",
                          name: event.output.name,
                          nodePath: event.output.nodePath,
                        });
                        break;
                    }
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
                    switch (event.output.type) {
                      case "root":
                        enqueue.raise({
                          type: "SELECT_DOCUMENT_ROOT_DESIGNER",
                        });
                        break;
                      case "paths":
                        enqueue.raise({
                          type: "SELECT_PATHS_DESIGNER",
                        });
                        break;
                      case "path":
                        enqueue.raise({
                          type: "SELECT_PATH_DESIGNER",
                          path: event.output.path,
                          nodePath: event.output.nodePath,
                        });
                        break;
                      case "datatypes":
                        enqueue.raise({
                          type: "SELECT_DATA_TYPES_DESIGNER",
                        });
                        break;
                      case "datatype":
                        enqueue.raise({
                          type: "SELECT_DATA_TYPE_DESIGNER",
                          name: event.output.name,
                          nodePath: event.output.nodePath,
                        });
                        break;
                      case "responses":
                        enqueue.raise({
                          type: "SELECT_RESPONSES_DESIGNER",
                        });
                        break;
                      case "response":
                        enqueue.raise({
                          type: "SELECT_RESPONSE_DESIGNER",
                          name: event.output.name,
                          nodePath: event.output.nodePath,
                        });
                        break;
                    }
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
          target: ["editor.viewChanged", "view.overview"],
          actions: [
            {
              type: "addToHistory",
              params: {
                node: { type: "root" },
              },
            },
          ],
        },
        SELECT_PATHS_DESIGNER: {
          target: ["editor.viewChanged", "view.paths"],
          actions: [
            {
              type: "addToHistory",
              params: {
                node: { type: "paths" },
              },
            },
          ],
        },
        SELECT_RESPONSES_DESIGNER: {
          target: ["editor.viewChanged", "view.responses"],
          actions: [
            {
              type: "addToHistory",
              params: {
                node: { type: "responses" },
              },
            },
          ],
        },
        SELECT_DATA_TYPES_DESIGNER: {
          target: ["editor.viewChanged", "view.dataTypes"],
          actions: [
            {
              type: "addToHistory",
              params: {
                node: { type: "datatypes" },
              },
            },
          ],
        },
        SELECT_PATH_DESIGNER: {
          target: ["editor.viewChanged", "view.path"],
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
          ],
        },
        SELECT_DATA_TYPE_DESIGNER: {
          target: ["editor.viewChanged", "view.dataType"],
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
          ],
        },
        SELECT_RESPONSE_DESIGNER: {
          target: ["editor.viewChanged", "view.response"],
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
          ],
        },
        SELECT_DOCUMENT_ROOT_CODE: {
          target: ["editor.viewChanged", "view.code"],
          actions: [
            {
              type: "addToHistory",
              params: {
                node: { type: "root" },
              },
            },
          ],
        },
        SELECT_PATHS_CODE: {
          target: ["editor.viewChanged", "view.code"],
          actions: [
            {
              type: "addToHistory",
              params: {
                node: { type: "paths" },
              },
            },
          ],
        },
        SELECT_RESPONSES_CODE: {
          target: ["editor.viewChanged", "view.code"],
          actions: [
            {
              type: "addToHistory",
              params: {
                node: { type: "responses" },
              },
            },
          ],
        },
        SELECT_DATA_TYPES_CODE: {
          target: ["editor.viewChanged", "view.code"],
          actions: [
            {
              type: "addToHistory",
              params: {
                node: { type: "datatypes" },
              },
            },
          ],
        },
        SELECT_PATH_CODE: {
          target: ["editor.viewChanged", "view.code"],
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
          ],
        },
        SELECT_DATA_TYPE_CODE: {
          target: ["editor.viewChanged", "view.code"],
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
          ],
        },
        SELECT_RESPONSE_CODE: {
          target: ["editor.viewChanged", "view.code"],
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
        GO_TO_DESIGNER_VIEW: [
          {
            target: ["editor.viewChanged", "view.overview"],
            guard: ({ context }) => context.currentNode.type === "root",
          },
          {
            target: ["editor.viewChanged", "view.paths"],
            guard: ({ context }) => context.currentNode.type === "paths",
          },
          {
            target: ["editor.viewChanged", "view.responses"],
            guard: ({ context }) => context.currentNode.type === "responses",
          },
          {
            target: ["editor.viewChanged", "view.dataTypes"],
            guard: ({ context }) => context.currentNode.type === "datatypes",
          },
          {
            target: ["editor.viewChanged", "view.path"],
            guard: ({ context }) => context.currentNode.type === "path",
          },
          {
            target: ["editor.viewChanged", "view.response"],
            guard: ({ context }) => context.currentNode.type === "response",
          },
          {
            target: ["editor.viewChanged", "view.dataType"],
            guard: ({ context }) => context.currentNode.type === "datatype",
          },
        ],
        GO_TO_CODE_VIEW: {
          target: ["editor.viewChanged", "view.code"],
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
    },
  },
});
