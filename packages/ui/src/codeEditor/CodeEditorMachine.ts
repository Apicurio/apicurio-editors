import { ActorRef, assign, fromPromise, sendTo, setup, Snapshot } from "xstate";
import { SelectedNode, Source, SourceType } from "../OpenApiEditorModels";

type Context = {
  source?: Source;
  selectedNode: SelectedNode;
  parentRef: ParentActor;
  title: string;
  isCloseable: boolean;
};

type Events =
  | {
      readonly type: "CHANGE_SOURCE";
      source: string;
    }
  | {
      readonly type: "CHANGE_SOURCE_TYPE";
      source: string;
      sourceType: SourceType;
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
    getNodeSource: fromPromise<Source, SelectedNode>(() =>
      Promise.resolve({} as Source)
    ),
    convertSource: fromPromise<
      Source,
      { source: string; sourceType: SourceType }
    >(() => Promise.resolve({} as Source)),
  },
  actions: {},
}).createMachine({
  id: "codeEditor",
  context: ({ input }) => {
    return {
      ...input,
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
    changingSourceType: {
      invoke: {
        src: "convertSource",
        input: ({ event }) => {
          if (event.type === "CHANGE_SOURCE_TYPE") {
            return {
              source: event.source,
              sourceType: event.sourceType,
            };
          }
          throw new Error("Unexpected event");
        },
        onDone: {
          actions: assign({
            source: ({ event }) => event.output,
          }),
          target: "idle",
        },
      },
    },
    idle: {
      on: {
        DOCUMENT_CHANGED: {
          target: "idle",
          reenter: true,
        },
        CHANGE_SOURCE_TYPE: {
          target: "changingSourceType",
          actions: assign({ source: undefined }),
          guard: ({ context, event }) =>
            context.source?.type !== event.sourceType,
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
