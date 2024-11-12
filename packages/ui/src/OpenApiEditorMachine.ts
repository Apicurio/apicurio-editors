import { assign, fromPromise, setup } from "xstate";
import {
  DocumentNavigation,
  EditorModel,
  SelectedNodeType,
} from "./OpenApiEditorModels";

type Context = EditorModel & {
  source?: object;
  navigationFilter: string;
};

type Events =
  | {
      readonly type: "xstate.init";
    }
  | {
      readonly type: "FILTER";
      filter: string;
    }
  | {
      readonly type: "SELECT_DOCUMENT_ROOT_DESIGNER";
    }
  | {
      readonly type: "SELECT_PATH_DESIGNER";
      path: string;
      nodePath: string;
    }
  | {
      readonly type: "SELECT_DATA_TYPE_DESIGNER";
      name: string;
      nodePath: string;
    }
  | {
      readonly type: "SELECT_RESPONSE_DESIGNER";
      name: string;
      nodePath: string;
    }
  | {
      readonly type: "SELECT_DOCUMENT_ROOT_CODE";
    }
  | {
      readonly type: "SELECT_PATH_CODE";
      path: string;
      nodePath: string;
    }
  | {
      readonly type: "SELECT_DATA_TYPE_CODE";
      name: string;
      nodePath: string;
    }
  | {
      readonly type: "SELECT_RESPONSE_CODE";
      name: string;
      nodePath: string;
    }
  | {
      readonly type: "SELECT_VALIDATION";
    }
  | {
      readonly type: "CHANGE_TITLE";
      title: string;
    }
  | {
      readonly type: "CHANGE_VERSION";
      version: string;
    }
  | {
      readonly type: "CHANGE_DESCRIPTION";
      description: string;
    }
  | {
      readonly type: "CHANGE_CONTACT_NAME";
      contactName: string;
    }
  | {
      readonly type: "CHANGE_CONTACT_EMAIL";
      contactEmail: string;
    }
  | {
      readonly type: "CHANGE_CONTACT_URL";
      contactUrl: string;
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
    };

export const OpenApiEditorMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
  actors: {
    getNodeSnapshot: fromPromise<EditorModel, SelectedNodeType>(() =>
      Promise.resolve({} as EditorModel)
    ),
    getNodeSource: fromPromise<
      EditorModel & { source: object },
      SelectedNodeType
    >(() => Promise.resolve({} as EditorModel & { source: object })),
    getDocumentNavigation: fromPromise<DocumentNavigation, string>(() =>
      Promise.resolve({} as DocumentNavigation)
    ),
    updateDocumentTitle: fromPromise<void, string>(() => Promise.resolve()),
    updateDocumentVersion: fromPromise<void, string>(() => Promise.resolve()),
    updateDocumentDescription: fromPromise<void, string>(() =>
      Promise.resolve()
    ),
    updateDocumentContactName: fromPromise<void, string>(() =>
      Promise.resolve()
    ),
    updateDocumentContactEmail: fromPromise<void, string>(() =>
      Promise.resolve()
    ),
    updateDocumentContactUrl: fromPromise<void, string>(() =>
      Promise.resolve()
    ),
    undoChange: fromPromise<void, void>(() => Promise.resolve()),
    redoChange: fromPromise<void, void>(() => Promise.resolve()),
  },
  actions: {},
}).createMachine({
  id: "openApiEditor",
  context: {
    node: {
      type: "root",
      node: {
        title: "",
        version: "",
        description: "",
        contactName: "",
        contactEmail: "",
        contactUrl: "",
        licenseName: "",
        licenseUrl: "",
        tags: [],
        servers: [],
        securityScheme: [],
        securityRequirements: [],
      },
    },
    navigation: {
      dataTypes: [],
      paths: [],
      responses: [],
    },
    navigationFilter: "",
    canUndo: false,
    canRedo: false,
    validationProblems: [],
  },
  type: "parallel",
  states: {
    selectedNode: {
      initial: "documentRoot",
      states: {
        hist: {
          type: "history",
          history: "deep",
        },
        validation: {
          id: "#document-validation",
        },
        documentRoot: {
          initial: "designer",
          states: {
            designer: {
              id: "documentRoot-view-designer",
              tags: ["designer"],
              initial: "loading",
              states: {
                loading: {
                  invoke: {
                    src: "getNodeSnapshot",
                    input: () => ({ type: "root" }),
                    onDone: {
                      target: "idle",
                      actions: assign(({ event }) => event.output),
                    },
                    onError: "error",
                  },
                },
                idle: {
                  invoke: {
                    src: "getNodeSnapshot",
                    input: () => ({ type: "root" }),
                    onDone: {
                      actions: assign(({ event }) => event.output),
                    },
                  },
                },
                error: {},
                updatingDocumentTitle: {
                  invoke: {
                    src: "updateDocumentTitle",
                    input: ({ event }) => {
                      if (event.type === "CHANGE_TITLE") {
                        return event.title;
                      }
                      throw new Error("Unknown event");
                    },
                    onDone: {
                      target: ["idle", "#editor.filtering"],
                    },
                  },
                },
                updatingDocumentVersion: {
                  invoke: {
                    src: "updateDocumentVersion",
                    input: ({ event }) => {
                      if (event.type === "CHANGE_VERSION") {
                        return event.version;
                      }
                      throw new Error("Unknown event");
                    },
                    onDone: {
                      target: ["idle", "#editor.filtering"],
                    },
                  },
                },
                updatingDocumentDescription: {
                  invoke: {
                    src: "updateDocumentDescription",
                    input: ({ event }) => {
                      if (event.type === "CHANGE_DESCRIPTION") {
                        return event.description;
                      }
                      throw new Error("Unknown event");
                    },
                    onDone: {
                      target: ["idle", "#editor.filtering"],
                    },
                  },
                },
                updatingDocumentContactName: {
                  invoke: {
                    src: "updateDocumentContactName",
                    input: ({ event }) => {
                      if (event.type === "CHANGE_CONTACT_NAME") {
                        return event.contactName;
                      }
                      throw new Error("Unknown event");
                    },
                    onDone: {
                      target: ["idle", "#editor.filtering"],
                    },
                  },
                },
                updatingDocumentContactEmail: {
                  invoke: {
                    src: "updateDocumentContactEmail",
                    input: ({ event }) => {
                      if (event.type === "CHANGE_CONTACT_EMAIL") {
                        return event.contactEmail;
                      }
                      throw new Error("Unknown event");
                    },
                    onDone: {
                      target: ["idle", "#editor.filtering"],
                    },
                  },
                },
                updatingDocumentContactUrl: {
                  invoke: {
                    src: "updateDocumentContactUrl",
                    input: ({ event }) => {
                      if (event.type === "CHANGE_CONTACT_URL") {
                        return event.contactUrl;
                      }
                      throw new Error("Unknown event");
                    },
                    onDone: {
                      target: ["idle", "#editor.filtering"],
                    },
                  },
                },
              },
              on: {
                CHANGE_TITLE: ".updatingDocumentTitle",
                CHANGE_VERSION: ".updatingDocumentVersion",
                CHANGE_DESCRIPTION: ".updatingDocumentDescription",
                CHANGE_CONTACT_NAME: ".updatingDocumentContactName",
                CHANGE_CONTACT_EMAIL: ".updatingDocumentContactEmail",
                CHANGE_CONTACT_URL: ".updatingDocumentContactUrl",
                GO_TO_CODE_VIEW: "#documentRoot-view-code",
              },
            },
            code: {
              id: "documentRoot-view-code",
              tags: ["code"],
              initial: "loading",
              states: {
                loading: {
                  invoke: {
                    src: "getNodeSource",
                    input: ({ event, context }) => {
                      if (event.type === "SELECT_DOCUMENT_ROOT_CODE") {
                        return { type: "root" };
                      } else if (context.node.type === "root") {
                        return context.node;
                      }
                      throw new Error("Unexpected event");
                    },
                    onDone: {
                      target: "idle",
                      actions: assign(({ event }) => event.output),
                    },
                    onError: "error",
                  },
                },
                idle: {},
                error: {},
              },
              on: {
                GO_TO_DESIGNER_VIEW: "#documentRoot-view-designer",
              },
            },
          },
        },
        path: {
          initial: "designer",
          states: {
            designer: {
              id: "path-view-designer",
              tags: ["designer"],
              initial: "loading",
              states: {
                loading: {
                  invoke: {
                    src: "getNodeSnapshot",
                    input: ({ event, context }) => {
                      if (event.type === "SELECT_PATH_DESIGNER") {
                        return {
                          type: "path",
                          path: event.path,
                          nodePath: event.nodePath,
                        };
                      } else if (context.node.type === "path") {
                        return context.node;
                      }
                      throw new Error("Unexpected event");
                    },
                    onDone: {
                      target: "idle",
                      actions: assign(({ event }) => event.output),
                    },
                    onError: "error",
                  },
                },
                idle: {},
                error: {},
              },
              on: {
                GO_TO_CODE_VIEW: "#path-view-code",
              },
            },
            code: {
              id: "path-view-code",
              tags: ["code"],
              initial: "loading",
              states: {
                loading: {
                  invoke: {
                    src: "getNodeSource",
                    input: ({ event, context }) => {
                      if (event.type === "SELECT_PATH_CODE") {
                        return {
                          type: "path",
                          path: event.path,
                          nodePath: event.nodePath,
                        };
                      } else if (context.node.type === "path") {
                        return context.node;
                      }
                      throw new Error("Unexpected event");
                    },
                    onDone: {
                      target: "idle",
                      actions: assign(({ event }) => event.output),
                    },
                    onError: "error",
                  },
                },
                idle: {},
                error: {},
              },
              on: {
                GO_TO_DESIGNER_VIEW: "#path-view-designer",
              },
            },
          },
        },
        dataType: {
          initial: "designer",
          states: {
            designer: {
              id: "dataType-view-designer",
              tags: ["designer"],
              initial: "loading",
              states: {
                loading: {
                  invoke: {
                    src: "getNodeSnapshot",
                    input: ({ event, context }) => {
                      if (event.type === "SELECT_DATA_TYPE_DESIGNER") {
                        return {
                          type: "datatype",
                          name: event.name,
                          nodePath: event.nodePath,
                        };
                      } else if (context.node.type === "datatype") {
                        return context.node;
                      }
                      throw new Error("Unexpected event");
                    },
                    onDone: {
                      target: "idle",
                      actions: assign(({ event }) => event.output),
                    },
                    onError: "error",
                  },
                },
                idle: {},
                error: {},
              },
              on: {
                GO_TO_CODE_VIEW: "#dataType-view-code",
              },
            },
            code: {
              id: "dataType-view-code",
              tags: ["code"],
              initial: "loading",
              states: {
                loading: {
                  invoke: {
                    src: "getNodeSource",
                    input: ({ event, context }) => {
                      if (event.type === "SELECT_DATA_TYPE_CODE") {
                        return {
                          type: "datatype",
                          name: event.name,
                          nodePath: event.nodePath,
                        };
                      } else if (context.node.type === "datatype") {
                        return context.node;
                      }
                      throw new Error("Unexpected event");
                    },
                    onDone: {
                      target: "idle",
                      actions: assign(({ event }) => event.output),
                    },
                    onError: "error",
                  },
                },
                idle: {},
                error: {},
              },
              on: {
                GO_TO_DESIGNER_VIEW: "#dataType-view-designer",
              },
            },
          },
        },
        response: {
          initial: "designer",
          states: {
            designer: {
              id: "response-view-designer",
              tags: ["designer"],
              initial: "loading",
              states: {
                loading: {
                  invoke: {
                    src: "getNodeSnapshot",
                    input: ({ event, context }) => {
                      if (event.type === "SELECT_RESPONSE_DESIGNER") {
                        return {
                          type: "response",
                          name: event.name,
                          nodePath: event.nodePath,
                        };
                      } else if (context.node.type === "response") {
                        return context.node;
                      }
                      throw new Error("Unexpected event");
                    },
                    onDone: {
                      target: "idle",
                      actions: assign(({ event }) => event.output),
                    },
                    onError: "error",
                  },
                },
                idle: {},
                error: {},
              },
              on: {
                GO_TO_CODE_VIEW: "#response-view-code",
              },
            },
            code: {
              id: "response-view-code",
              tags: ["code"],
              initial: "loading",
              states: {
                loading: {
                  invoke: {
                    src: "getNodeSource",
                    input: ({ event, context }) => {
                      if (event.type === "SELECT_RESPONSE_CODE") {
                        return {
                          type: "response",
                          name: event.name,
                          nodePath: event.nodePath,
                        };
                      } else if (context.node.type === "response") {
                        return context.node;
                      }
                      throw new Error("Unexpected event");
                    },
                    onDone: {
                      target: "idle",
                      actions: assign(({ event }) => event.output),
                    },
                    onError: "error",
                  },
                },
                idle: {},
                error: {},
              },
              on: {
                GO_TO_DESIGNER_VIEW: "#response-view-designer",
              },
            },
          },
        },
      },
    },
    editor: {
      id: "editor",
      initial: "idle",
      states: {
        idle: {},
        undoing: {
          invoke: {
            src: "undoChange",
            onDone: {
              target: ["filtering", "#openApiEditor.selectedNode.hist"],
              reenter: true,
            },
          },
        },
        redoing: {
          invoke: {
            src: "redoChange",
            onDone: {
              target: ["filtering", "#openApiEditor.selectedNode.hist"],
              reenter: true,
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
        FILTER: {
          target: ".debouncing",
          actions: assign({ navigationFilter: ({ event }) => event.filter }),
        },
        SELECT_DOCUMENT_ROOT_DESIGNER: {
          target: "#documentRoot-view-designer",
          actions: assign({ source: undefined }),
        },
        SELECT_PATH_DESIGNER: {
          target: "#path-view-designer",
          actions: assign({ source: undefined }),
        },
        SELECT_DATA_TYPE_DESIGNER: {
          target: "#dataType-view-designer",
          actions: assign({ source: undefined }),
        },
        SELECT_RESPONSE_DESIGNER: {
          target: "#response-view-designer",
          actions: assign({ source: undefined }),
        },
        SELECT_DOCUMENT_ROOT_CODE: {
          target: "#documentRoot-view-code",
          actions: assign({ source: undefined }),
        },
        SELECT_PATH_CODE: {
          target: "#path-view-code",
          actions: assign({ source: undefined }),
        },
        SELECT_DATA_TYPE_CODE: {
          target: "#dataType-view-code",
          actions: assign({ source: undefined }),
        },
        SELECT_RESPONSE_CODE: {
          target: "#response-view-code",
          actions: assign({ source: undefined }),
        },
        SELECT_VALIDATION: {
          target: "#openApiEditor.selectedNode.validation",
          actions: assign({ source: undefined }),
        },
        UNDO: ".undoing",
        REDO: ".redoing",
      },
    },
  },
});
