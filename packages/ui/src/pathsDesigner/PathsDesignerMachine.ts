import { ActorRef, assign, fromPromise, sendTo, setup, Snapshot } from "xstate";
import { Paths } from "../OpenApiEditorModels";

type Context = Paths & {
  parentRef: ParentActor;
  editable: boolean;
};

type Events = {
  readonly type: "DOCUMENT_CHANGED";
};

type ParentActor = ActorRef<
  Snapshot<unknown>,
  Extract<Events, { type: "DOCUMENT_CHANGED" }>
>;

export const PathsDesignerMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as {
      parentRef: ParentActor;
    },
  },
  actors: {
    getPathsSnapshot: fromPromise<Paths, void>(() =>
      Promise.resolve({} as Paths),
    ),
  },
  actions: {},
}).createMachine({
  id: "pathsDesigner",
  context: ({ input }) => {
    return {
      ...input,
    } as Context;
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: "getPathsSnapshot",
        onDone: {
          target: "idle",
          actions: assign(({ event }) => event.output),
        },
        onError: "error",
      },
    },
    idle: {
      invoke: {
        src: "getPathsSnapshot",
        onDone: {
          actions: assign(({ event }) => event.output),
        },
      },
      on: {
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
  },
});
