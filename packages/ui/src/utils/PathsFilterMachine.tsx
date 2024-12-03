import { assign, setup } from "xstate";
import { Path } from "../OpenApiEditorModels.ts";

function normalize(str: string) {
  return str.toLowerCase().trim().normalize("NFC");
}

function isMatch(filter: string, someString?: string) {
  if (!someString) {
    return false;
  }
  return normalize(someString).includes(filter);
}

export const PathsFilterMachine = setup({
  types: {
    context: {} as {
      paths: Path[];
      initialPaths: Path[];
      filter: string;
    },
    events: {} as { readonly type: "SEARCH"; filter: string },
    input: {} as {
      paths: Path[];
    },
  },
}).createMachine({
  id: "pathsExplorer",
  context: ({ input }) => ({
    paths: input.paths,
    initialPaths: input.paths,
    filter: "",
  }),
  initial: "idle",
  states: {
    idle: {
      entry: assign({
        paths: ({ context: { initialPaths } }) => initialPaths,
      }),
    },
    filtered: {
      entry: assign({
        paths: ({ context: { initialPaths, filter } }) => {
          const normalizedFilter = normalize(filter);
          return initialPaths.filter((path) =>
            isMatch(normalizedFilter, JSON.stringify(path)),
          );
        },
      }),
    },
    debouncing: {
      after: {
        200: [
          {
            target: "filtered",
            guard: ({ context: { filter } }) => filter.length > 0,
          },
          {
            target: "idle",
          },
        ],
      },
    },
  },
  on: {
    SEARCH: {
      target: ".debouncing",
      actions: assign({ filter: ({ event }) => event.filter }),
      reenter: true,
    },
  },
});
