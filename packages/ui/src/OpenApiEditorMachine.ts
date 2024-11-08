import { assign, fromPromise, setup } from "xstate";
import {
  DocumentNavigation,
  EditorModel,
  SelectedNode,
} from "./OpenApiEditorModels";

type PartialSelectedNode = Pick<SelectedNode, "type" | "path">;

type Context = EditorModel & {
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
      readonly type: "SELECT_DOCUMENT_ROOT";
    }
  | {
      readonly type: "SELECT_PATH";
      selectedNode: PartialSelectedNode;
    }
  | {
      readonly type: "SELECT_DATA_TYPE";
      selectedNode: PartialSelectedNode;
    }
  | {
      readonly type: "SELECT_RESPONSE";
      selectedNode: PartialSelectedNode;
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
      readonly type: "GO_TO_YAML_VIEW";
    };

export const OpenApiEditorMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
  actors: {
    getDocumentSnapshot: fromPromise<EditorModel, void>(() =>
      Promise.resolve({} as EditorModel)
    ),
    getDocumentNavigation: fromPromise<DocumentNavigation, string>(() =>
      Promise.resolve({} as DocumentNavigation)
    ),
    updateDocumentTitle: fromPromise<EditorModel, string>(() =>
      Promise.resolve({} as EditorModel)
    ),
    updateDocumentVersion: fromPromise<EditorModel, string>(() =>
      Promise.resolve({} as EditorModel)
    ),
    updateDocumentDescription: fromPromise<EditorModel, string>(() =>
      Promise.resolve({} as EditorModel)
    ),
    updateDocumentContactName: fromPromise<EditorModel, string>(() =>
      Promise.resolve({} as EditorModel)
    ),
    updateDocumentContactEmail: fromPromise<EditorModel, string>(() =>
      Promise.resolve({} as EditorModel)
    ),
    updateDocumentContactUrl: fromPromise<EditorModel, string>(() =>
      Promise.resolve({} as EditorModel)
    ),
    undoChange: fromPromise<EditorModel, void>(() =>
      Promise.resolve({} as EditorModel)
    ),
    redoChange: fromPromise<EditorModel, void>(() =>
      Promise.resolve({} as EditorModel)
    ),
  },
  actions: {},
}).createMachine({
  id: "openApiEditor",
  context: {
    documentRoot: {
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
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: "getDocumentSnapshot",
        onDone: {
          target: "ready",
          actions: assign(({ event }) => event.output),
        },
        onError: "error",
      },
    },
    ready: {
      type: "parallel",
      states: {
        selectedNode: {
          initial: "documentRoot",
          states: {
            validation: {
              id: "#document-validation",
            },
            documentRoot: {
              initial: "designer",
              states: {
                designer: {
                  id: "root-view-designer",
                  initial: "idle",
                  states: {
                    idle: {},
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
                          actions: assign(({ event }) => event.output),
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
                          actions: assign(({ event }) => event.output),
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
                          actions: assign(({ event }) => event.output),
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
                          actions: assign(({ event }) => event.output),
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
                          actions: assign(({ event }) => event.output),
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
                          actions: assign(({ event }) => event.output),
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
                    GO_TO_YAML_VIEW: "#root-view-yaml",
                  },
                },
                yaml: {
                  id: "root-view-yaml",
                  on: {
                    GO_TO_DESIGNER_VIEW: "#root-view-designer",
                  },
                },
              },
            },
            path: {
              initial: "designer",
              states: {
                designer: {
                  id: "path-view-designer",
                  on: {
                    GO_TO_YAML_VIEW: "#path-view-yaml",
                  },
                },
                yaml: {
                  id: "path-view-yaml",
                  on: {
                    GO_TO_YAML_VIEW: "#path-view-designer",
                  },
                },
              },
            },
            dataType: {
              initial: "designer",
              states: {
                designer: {
                  id: "dataType-view-designer",
                  on: {
                    GO_TO_YAML_VIEW: "#dataType-view-yaml",
                  },
                },
                yaml: {
                  id: "dataType-view-yaml",
                  on: {
                    GO_TO_YAML_VIEW: "#dataType-view-designer",
                  },
                },
              },
            },
            response: {
              initial: "designer",
              states: {
                designer: {
                  id: "response-view-designer",
                  on: {
                    GO_TO_YAML_VIEW: "#response-view-yaml",
                  },
                },
                yaml: {
                  id: "response-view-yaml",
                  on: {
                    GO_TO_YAML_VIEW: "#response-view-designer",
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
                  target: "filtering",
                  actions: assign(({ event }) => event.output),
                },
              },
            },
            redoing: {
              invoke: {
                src: "redoChange",
                onDone: {
                  target: "filtering",
                  actions: assign(({ event }) => event.output),
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
        },
      },
      on: {
        FILTER: {
          target: ".editor.debouncing",
          actions: assign({ navigationFilter: ({ event }) => event.filter }),
        },
        SELECT_DOCUMENT_ROOT: {
          target: "#root-view-designer",
          actions: assign({
            selectedNode: undefined,
          }),
        },
        SELECT_PATH: {
          target: "#path-view-designer",
          actions: assign({
            selectedNode: ({ event }) => event.selectedNode,
          }),
        },
        SELECT_DATA_TYPE: {
          target: "#dataType-view-designer",
          actions: assign({
            selectedNode: ({ event }) => event.selectedNode,
          }),
        },
        SELECT_RESPONSE: {
          target: "#response-view-designer",
          actions: assign({
            selectedNode: ({ event }) => event.selectedNode,
          }),
        },
        SELECT_VALIDATION: {
          target: ".selectedNode.validation",
        },
        UNDO: ".editor.undoing",
        REDO: ".editor.redoing",
      },
    },
    error: {},
  },
});
