import { assign, fromPromise, setup } from "xstate";
import { DocumentNavigation, EditorModel } from "./OpenApiEditorModels";

type SelectedNode =
  | {
      type: "path";
      path: string;
    }
  | {
      type: "datatype";
      path: string;
    }
  | {
      type: "response";
      path: string;
    };

type Context = EditorModel & {
  navigationFilter: string;
  selectedNode?: SelectedNode;
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
      readonly type: "SELECT_NODE";
      selectedNode: SelectedNode;
    }
  | {
      readonly type: "DESELECT_NODE";
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
    filterNavigation: fromPromise<DocumentNavigation, string>(() =>
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
    undo: fromPromise<EditorModel, void>(() =>
      Promise.resolve({} as EditorModel)
    ),
    redo: fromPromise<EditorModel, void>(() =>
      Promise.resolve({} as EditorModel)
    ),
  },
  actions: {},
}).createMachine({
  id: "openApiEditor",
  context: {
    document: {
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
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: "getDocumentSnapshot",
        onDone: {
          target: "idle",
          actions: assign(({ event }) => event.output),
        },
        onError: "error",
      },
    },
    idle: {
      on: {
        FILTER: {
          target: "debouncing",
          actions: assign({ navigationFilter: ({ event }) => event.filter }),
        },
        SELECT_NODE: {
          actions: assign({
            selectedNode: ({ event }) => event.selectedNode,
          }),
        },
        DESELECT_NODE: {
          actions: assign({
            selectedNode: undefined,
          }),
        },
        CHANGE_TITLE: "updatingDocumentTitle",
        CHANGE_VERSION: "updatingDocumentVersion",
        CHANGE_DESCRIPTION: "updatingDocumentDescription",
        CHANGE_CONTACT_NAME: "updatingDocumentContactName",
        CHANGE_CONTACT_EMAIL: "updatingDocumentContactEmail",
        CHANGE_CONTACT_URL: "updatingDocumentContactUrl",
        UNDO: "undoing",
        REDO: "redoing",
      },
    },
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
          target: "filtering",
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
          target: "filtering",
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
          target: "filtering",
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
          target: "filtering",
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
          target: "filtering",
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
          target: "filtering",
          actions: assign(({ event }) => event.output),
        },
      },
    },
    undoing: {
      invoke: {
        src: "undo",
        onDone: {
          target: "filtering",
          actions: assign(({ event }) => event.output),
        },
      },
    },
    redoing: {
      invoke: {
        src: "redo",
        onDone: {
          target: "filtering",
          actions: assign(({ event }) => event.output),
        },
      },
    },
    debouncing: {
      on: {
        FILTER: {
          target: "debouncing",
          reenter: true,
          actions: assign({ navigationFilter: ({ event }) => event.filter }),
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
          actions: assign({ navigationFilter: ({ event }) => event.filter }),
        },
      },
      invoke: {
        src: "filterNavigation",
        input: ({ context }) => context.navigationFilter,
        onDone: {
          target: "idle",
          actions: assign({
            navigation: ({ event }) => event.output,
          }),
        },
      },
    },
    error: {},
  },
});
