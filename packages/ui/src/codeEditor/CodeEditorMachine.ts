import { ActorRef, assign, fromPromise, sendTo, setup, Snapshot } from "xstate";
import { SelectedNode } from "../OpenApiEditorModels";

type Context = {
  source: object;
  selectedNode: SelectedNode;
  parentRef: ParentActor;
  title: string;
  isCloseable: boolean;
};

type Events =
  | {
      readonly type: "CHANGE_SOURCE";
      source: object;
    }
  | {
      readonly type: "DOCUMENT_CHANGED";
    };

type ParentActor = ActorRef<
  Snapshot<unknown>,
  Extract<Events, { type: "DOCUMENT_CHANGED" }>
>;

export const CodeEditorMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as Omit<Context, "source">,
  },
  actors: {
    getNodeSource: fromPromise<object, SelectedNode>(() => Promise.resolve({})),
  },
  actions: {},
}).createMachine({
  id: "codeEditor",
  context: ({ input }) => {
    return {
      ...input,
      source: {},
    };
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: "getNodeSource",
        input: ({ context }) => context.selectedNode,
        onDone: {
          target: "idle",
          actions: assign({ source: ({ event }) => event.output }),
        },
        onError: "error",
      },
    },
    idle: {
      invoke: {
        src: "getNodeSource",
        input: ({ context }) => context.selectedNode,
        onDone: {
          actions: assign({ source: ({ event }) => event.output }),
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
