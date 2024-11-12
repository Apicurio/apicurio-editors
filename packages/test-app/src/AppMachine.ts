import { assign, fromPromise, setup } from "xstate";

import { worker } from "./rpc.ts";

type Context = {
  spec: string | undefined;
  error: string | undefined;
};

interface Input {
  readonly spec: string | undefined;
}

type Events =
  | { readonly type: "xstate.init"; readonly input: Input }
  | { readonly type: "SPEC"; readonly content: string };

function Input(input: Input): Promise<Context> {
  if (input.spec !== undefined) {
    return Promise.resolve({
      spec: input.spec,
      error: undefined,
    });
  }
  return Promise.reject();
}

async function ParseSpec(input: Input): Promise<boolean> {
  if (input.spec !== undefined) {
    try {
      await worker.parseOasSchema(input.spec);
      return true;
    } catch (e) {
      console.error("ParseSpec", { e, input });
    }
  }
  return Promise.reject();
}

export const appMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    input: {} as Input,
  },
  actors: {
    checkPreviousSession: fromPromise<Context, Input>(({ input }) =>
      Input(input),
    ),
    parseSpec: fromPromise<boolean, Input>(({ input }) => ParseSpec(input)),
  },
  actions: {},
}).createMachine({
  id: "editor",
  context: {
    spec: undefined,
    error: undefined,
  },
  invoke: {
    src: "checkPreviousSession",
    input: ({ event }) => {
      if (event.type === "xstate.init") {
        return event.input;
      }
      throw new Error("Unexpected event type");
    },
    onDone: {
      target: ".idle.previousWorkAvailable",
    },
    onError: ".idle.nothingToRestore",
  },
  initial: "idle",
  states: {
    idle: {
      initial: "nothingToRestore",
      states: {
        nothingToRestore: {},
        previousWorkAvailable: {},
        invalidSpec: {},
      },
      on: {
        SPEC: {
          target: "parsing",
          actions: assign(({ event }) => ({ spec: event.content })),
        },
      },
    },
    parsing: {
      initial: "parsing",
      invoke: {
        src: "parseSpec",
        input: ({ context }) => {
          if (context.spec) {
            return context;
          }
          throw new Error("Empty spec");
        },
        onDone: {
          target: ".success",
        },
        onError: {
          target: ".failure",
        },
      },
      states: {
        parsing: {},
        success: {
          always: "#editor.parsed",
        },
        failure: {
          always: "#editor.idle.invalidSpec",
        },
      },
    },
    parsed: {},
  },
});
