import { assign, setup } from "xstate";
import { Path } from "../OpenApiEditorMachine.tsx";

type Context = {
  paths: Path[];
  filter: string;
};

type Events =
  | { readonly type: "FILTER"; readonly filter: string }
  | { readonly type: "UPDATE"; readonly paths: Path[] };

type Input = {
  paths: Path[];
  filter: string;
};

export const EditorSidebarMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as Input,
  },
  actions: {
    onFilter: (filter: string) => {},
  },
}).createMachine({
  id: "paths",
  context: ({ input }) => ({
    paths: input.paths,
    filter: input.filter,
  }),
  initial: "idle",
  states: {
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
          actions: ["onFilter"],
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
    loading: {},
  },
  on: {
    UPDATE: {
      target: ".idle",
      actions: assign({
        paths: ({ event }) => event.paths,
      }),
    },
  },
});
