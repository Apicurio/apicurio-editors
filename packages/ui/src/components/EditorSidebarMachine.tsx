import { assign, fromPromise, setup } from "xstate";

type Context = {
  paths: string[];
  filter: string | undefined;
};
type Events = { readonly type: "FILTER"; readonly filter: string };
export const editorSidebarMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
  actions: {},
  actors: {
    getPaths: fromPromise<string[], string | undefined>(() =>
      Promise.resolve([] as string[])
    ),
  },
}).createMachine({
  id: "paths",
  context: {
    paths: [],
    filter: undefined,
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: "getPaths",
        input: ({ context }) => {
          return context.filter;
        },
        onDone: {
          target: "idle",
          actions: assign({
            paths: ({ event }) => event.output,
          }),
        },
      },
    },
    debouncing: {
      on: {
        FILTER: {
          target: "debouncing",
          reenter: true,
          actions: assign({ filter: ({ event }) => event.filter }),
        },
      },
      after: {
        200: {
          target: "loading",
        },
      },
    },
    idle: {
      on: {
        FILTER: {
          target: "debouncing",
          actions: assign({ filter: ({ event }) => event.filter }),
        },
      },
    },
  },
});
