import { ActorRef, assign, fromPromise, sendTo, setup, Snapshot } from "xstate";
import { DocumentPath, NodePath } from "../OpenApiEditorModels";

type Context = DocumentPath & {
  path: NodePath;
  editable: boolean;
  parentRef: ParentActor;
};

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

type ParentActor = ActorRef<
  Snapshot<unknown>,
  Extract<Events, { type: "DOCUMENT_CHANGED" }>
>;

export const PathDesignerMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as {
      path: NodePath;
      editable: boolean;
      parentRef: ParentActor;
    },
  },
  actors: {
    getPathSnapshot: fromPromise<DocumentPath, NodePath>(() =>
      Promise.resolve({} as DocumentPath)
    ),
    updateSummary: fromPromise<void, string>(() => Promise.resolve()),
    updateDescription: fromPromise<void, string>(() => Promise.resolve()),
  },
  actions: {},
}).createMachine({
  id: "pathDesigner",
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
        input: ({ context }) => context.path,
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
        input: ({ context }) => context.path,
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
      entry: sendTo(({ context }) => context.parentRef, {
        type: "DOCUMENT_CHANGED",
      }),
    },
    error: {},
    updatingSummary: {
      invoke: {
        src: "updateSummary",
        input: ({ event }) => {
          if (event.type === "CHANGE_SUMMARY") {
            return event.summary;
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
