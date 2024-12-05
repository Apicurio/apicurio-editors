import { assign, fromPromise, sendTo, setup } from "xstate";
import { Path, Paths } from "../../OpenApiEditorModels.ts";

function normalize(str: string) {
  return str.toLowerCase().trim().normalize("NFC");
}

function isMatch(filter: string, someString?: string) {
  if (!someString) {
    return false;
  }
  return normalize(someString).includes(filter);
}

type Context = Paths & {
  filteredPaths: Path[];
  filter: string;
};

type Events =
  | {
      readonly type: "DOCUMENT_CHANGED";
    }
  | { readonly type: "SEARCH"; readonly filter: string };

export const PathsMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
  actors: {
    getPathsSnapshot: fromPromise<Paths, void>(() =>
      Promise.resolve({} as Paths),
    ),
  },
  actions: {},
}).createMachine({
  id: "paths",
  context: {
    filteredPaths: [],
    paths: [],
    filter: "",
  },
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: "getPathsSnapshot",
        onDone: {
          target: "idle",
          actions: assign(({ event }) => ({
            paths: event.output.paths,
            filteredPaths: event.output.paths,
          })),
        },
        onError: "error",
      },
    },
    idle: {},
    update: {
      invoke: {
        src: "getPathsSnapshot",
        onDone: {
          actions: assign(({ event }) => event.output),
          target: "idle",
        },
      },
    },
    debouncing: {
      after: {
        200: [
          {
            target: "idle",
            actions: assign({
              filteredPaths: ({ context: { paths, filter } }) => {
                const normalizedFilter = normalize(filter);
                return paths.filter((path) =>
                  isMatch(normalizedFilter, JSON.stringify(path)),
                );
              },
            }),
            guard: ({ context: { filter } }) => filter.length > 0,
          },
          {
            target: "idle",
          },
        ],
      },
    },
    afterChange: {
      always: "update",
      entry: sendTo(({ system }) => system.get("editor"), {
        type: "DOCUMENT_CHANGED",
      }),
    },
    error: {},
  },
  on: {
    DOCUMENT_CHANGED: {
      target: ".update",
    },
    SEARCH: {
      target: ".debouncing",
      actions: assign({ filter: ({ event }) => event.filter }),
    },
  },
});
