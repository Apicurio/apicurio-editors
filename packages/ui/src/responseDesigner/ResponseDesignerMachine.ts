import { ActorRef, assign, fromPromise, sendTo, setup, Snapshot } from "xstate";
import {
  DocumentPath,
  DocumentResponse,
  NodeResponse,
} from "../OpenApiEditorModels";

type Context = DocumentPath & {
  response: NodeResponse;
  parentRef: ParentActor;
};

type Events =
  | {
      readonly type: "CHANGE_DESCRIPTION";
      description: string;
    }
  | {
      readonly type: "DOCUMENT_CHANGED";
    };

type ParentActor = ActorRef<
  Snapshot<unknown>,
  Extract<Events, { type: "DOCUMENT_CHANGED" }>
>;

export const ResponseDesignerMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as {
      response: NodeResponse;
      parentRef: ParentActor;
    },
  },
  actors: {
    getResponseSnapshot: fromPromise<DocumentResponse, NodeResponse>(() =>
      Promise.resolve({} as DocumentResponse)
    ),
    updateDescription: fromPromise<void, string>(() => Promise.resolve()),
  },
  actions: {},
}).createMachine({
  id: "responseDesigner",
  context: ({ input }) => {
    return {
      ...input,
    } as Context;
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: "getResponseSnapshot",
        input: ({ context }) => context.response,
        onDone: {
          target: "idle",
          actions: assign(({ event }) => event.output),
        },
        onError: "error",
      },
    },
    idle: {
      invoke: {
        src: "getResponseSnapshot",
        input: ({ context }) => context.response,
        onDone: {
          actions: assign(({ event }) => event.output),
        },
      },
      on: {
        CHANGE_DESCRIPTION: "updatingDescription",
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
    updatingDescription: {
      invoke: {
        src: "updateDescription",
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
  },
});
