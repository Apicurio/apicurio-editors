import { assign, fromPromise, sendTo, setup } from "xstate";
import { NodeResponse, Response } from "../../OpenApiEditorModels.ts";

type Context = Response & {
  node: NodeResponse;
};

type Events =
  | {
      readonly type: "CHANGE_DESCRIPTION";
      description: string;
    }
  | {
      readonly type: "DOCUMENT_CHANGED";
    };

export const ResponseDesignerMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as {
      node: NodeResponse;
    },
  },
  actors: {
    getResponseSnapshot: fromPromise<Response, NodeResponse>(() =>
      Promise.resolve({} as Response),
    ),
    updateDescription: fromPromise<void, string>(() => Promise.resolve()),
  },
  actions: {},
}).createMachine({
  id: "nodeDesigner",
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
        input: ({ context }) => context.node,
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
        input: ({ context }) => context.node,
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
      entry: sendTo(({ system }) => system.get("editor"), {
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
