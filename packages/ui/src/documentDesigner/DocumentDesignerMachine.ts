import { ActorRef, assign, fromPromise, sendTo, setup, Snapshot } from "xstate";
import { Document } from "../OpenApiEditorModels";

type Context = Document & {
  parentRef: ParentActor;
  editable: boolean;
};

type Events =
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
      readonly type: "DOCUMENT_CHANGED";
    };

type ParentActor = ActorRef<
  Snapshot<unknown>,
  Extract<Events, { type: "DOCUMENT_CHANGED" }>
>;

export const DocumentDesignerMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as {
      parentRef: ParentActor;
      editable: boolean;
    },
  },
  actors: {
    getDocumentSnapshot: fromPromise<Document, void>(() =>
      Promise.resolve({} as Document)
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
  },
  actions: {},
}).createMachine({
  id: "documentDesigner",
  context: ({ input }) => {
    return {
      ...input,
    } as Context;
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
      invoke: {
        src: "getDocumentSnapshot",
        onDone: {
          actions: assign(({ event }) => event.output),
        },
      },
      on: {
        CHANGE_TITLE: "updatingDocumentTitle",
        CHANGE_VERSION: "updatingDocumentVersion",
        CHANGE_DESCRIPTION: "updatingDocumentDescription",
        CHANGE_CONTACT_NAME: "updatingDocumentContactName",
        CHANGE_CONTACT_EMAIL: "updatingDocumentContactEmail",
        CHANGE_CONTACT_URL: "updatingDocumentContactUrl",
        DOCUMENT_CHANGED: {
          target: "idle",
          reenter: true,
        },
      },
    },
    afterChange: {
      always: "idle",
      entry: sendTo(({ context }) => context.parentRef, {
        type: "DOCUMENT_CHANGED",
      }),
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
          target: "afterChange",
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
          target: "afterChange",
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
          target: "afterChange",
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
          target: "afterChange",
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
          target: "afterChange",
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
          target: "afterChange",
        },
      },
    },
  },
});
