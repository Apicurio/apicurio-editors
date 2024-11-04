import { assign, fromPromise, setup } from "xstate";

export type NavigationPath = {
  name: string;
  validations: string[];
};

export type NavigationDataType = {
  name: string;
  validations: string[];
};

export type NavigationResponse = {
  name: string;
  validations: string[];
};

export type DocumentNavigation = {
  paths: NavigationPath[];
  dataTypes: NavigationDataType[];
  responses: NavigationResponse[];
};

export type DocumentPath = {};
export type DocumentDataType = {};

export type DocumentResponse = {};

export type Document = {
  title: string;
  navigation: DocumentNavigation;
  canUndo: boolean;
  canRedo: boolean;
};

type Context = Document & {
  navigationFilter: string;
  navigationSelection?: string;
  selectedNode?: DocumentPath | DocumentDataType | DocumentResponse;
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
      readonly type: "CHANGE_TITLE";
      title: string;
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
    getDocumentSnapshot: fromPromise<Document, void>(() =>
      Promise.resolve({} as Document)
    ),
    filterNavigation: fromPromise<DocumentNavigation, string>(() =>
      Promise.resolve({} as DocumentNavigation)
    ),
    updateDocumentTitle: fromPromise<Document, string>(() =>
      Promise.resolve({} as Document)
    ),
    undo: fromPromise<Document, void>(() => Promise.resolve({} as Document)),
    redo: fromPromise<Document, void>(() => Promise.resolve({} as Document)),
  },
  actions: {},
}).createMachine({
  id: "openApiEditor",
  context: {
    title: "",
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
          target: "filtering",
          actions: assign({ navigationFilter: ({ event }) => event.filter }),
        },
        CHANGE_TITLE: "updatingDocumentTitle",
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
