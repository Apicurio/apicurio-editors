import { ActorRef, assign, fromPromise, sendTo, setup, Snapshot } from "xstate";
import { DataType, NodeDataType } from "../OpenApiEditorModels";

type Context = DataType & {
  dataType: NodeDataType;
  editable: boolean;
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

export const DataTypeDesignerMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as {
      dataType: NodeDataType;
      editable: boolean;
      parentRef: ParentActor;
    },
  },
  actors: {
    getDataTypeSnapshot: fromPromise<DataType, NodeDataType>(() =>
      Promise.resolve({} as DataType),
    ),
    updateDescription: fromPromise<void, string>(() => Promise.resolve()),
  },
  actions: {},
}).createMachine({
  id: "documentRootDesigner",
  context: ({ input }) => {
    return {
      ...input,
    } as Context;
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: "getDataTypeSnapshot",
        input: ({ context }) => context.dataType,
        onDone: {
          target: "idle",
          actions: assign(({ event }) => event.output),
        },
        onError: "error",
      },
    },
    idle: {
      invoke: {
        src: "getDataTypeSnapshot",
        input: ({ context }) => context.dataType,
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
