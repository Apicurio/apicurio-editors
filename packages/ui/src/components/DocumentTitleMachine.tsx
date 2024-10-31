import { assign, fromPromise, setup } from "xstate";

type Context = {
  title: string | undefined;
  error?: string;
};
type Events = { readonly type: "EDIT"; readonly title: string };
export const documentTitleMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
  actions: {},
  actors: {
    getTitle: fromPromise<string | undefined>(() => Promise.resolve("")),
    editTitle: fromPromise<void, string>(() => Promise.resolve()),
  },
}).createMachine({
  id: "documentTitle",
  context: {
    title: undefined,
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: "getTitle",
        onDone: {
          target: "idle",
          actions: assign({
            title: ({ event }) => event.output,
          }),
        },
      },
    },
    editing: {
      invoke: {
        src: "editTitle",
        input: ({ context }) => {
          if (context.title && context.title.length > 0) return context.title;
          throw new Error("Can't save an empty title");
        },
        onDone: "loading",
        onError: {
          target: "idle",
        },
      },
    },
    idle: {
      on: {
        EDIT: {
          target: "editing",
          actions: assign({ title: ({ event }) => event.title }),
        },
      },
    },
  },
});
