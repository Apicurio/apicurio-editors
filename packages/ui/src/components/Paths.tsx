import { Spinner, TextInput } from "@patternfly/react-core";
import { useMachine } from "@xstate/react";
import { assign, fromPromise, setup } from "xstate";

type Context = {
  paths: string[];
  filter: string | undefined;
};

type Events = { readonly type: "FILTER"; readonly filter: string };

const machine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
  actions: {},
  actors: {
    getPaths: fromPromise<string[], string | undefined>(({ input }) =>
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
    idle: {
      on: {
        FILTER: {
          target: "loading",
          actions: assign({ filter: ({ event }) => event.filter }),
        },
      },
    },
  },
});

export type PathsProps = {
  getPaths: (filter?: string) => Promise<string[]>;
};

export function Paths({ getPaths }: PathsProps) {
  const [state, send] = useMachine(
    machine.provide({
      actors: { getPaths: fromPromise(({ input }) => getPaths(input)) },
    }),
    { input: { spec: undefined } }
  );

  console.log("Paths", state.value, state.context);

  switch (state.value) {
    case "loading":
      return <Spinner />;
    case "idle":
      return (
        <div>
          <TextInput
            autoFocus={true}
            value={state.context.filter}
            onChange={(_, filter) => send({ type: "FILTER", filter })}
          />
          <ul>
            {state.context.paths.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      );
  }
}
