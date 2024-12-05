import { assign, fromPromise, sendTo, setup } from "xstate";
import { NodePath, Path } from "../../OpenApiEditorModels.ts";

type Context = Path;

type Events =
  | {
      readonly type: "CHANGE_SUMMARY";
      summary: string;
    }
  | {
      readonly type: "CHANGE_DESCRIPTION";
      description: string;
    }
  | {
      readonly type: "DOCUMENT_CHANGED";
    };

export const PathMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as {
      node: NodePath;
    },
  },
  actors: {
    getPathSnapshot: fromPromise<Path, NodePath>(() =>
      Promise.resolve({} as Path),
    ),
    updateSummary: fromPromise<void, { node: NodePath; summary: string }>(() =>
      Promise.resolve(),
    ),
    updateDescription: fromPromise<
      void,
      { node: NodePath; description: string }
    >(() => Promise.resolve()),
  },
  actions: {},
}).createMachine({
  id: "path",
  context: ({ input }) => {
    return {
      ...input,
    } as Context;
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: "getPathSnapshot",
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
        src: "getPathSnapshot",
        input: ({ context }) => context.node,
        onDone: {
          actions: assign(({ event }) => event.output),
        },
      },
      on: {
        CHANGE_SUMMARY: "updatingSummary",
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
    updatingSummary: {
      invoke: {
        src: "updateSummary",
        input: ({ event, context }) => {
          if (event.type === "CHANGE_SUMMARY") {
            return { node: context.node, summary: event.summary };
          }
          throw new Error("Unknown event");
        },
        onDone: {
          target: "afterChange",
        },
      },
    },
    updatingDescription: {
      invoke: {
        src: "updateDescription",
        input: ({ event, context }) => {
          if (event.type === "CHANGE_DESCRIPTION") {
            return { node: context.node, description: event.description };
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
