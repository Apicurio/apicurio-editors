import "@patternfly/react-core/dist/styles/base.css"; // This import needs to be first
import "./App.css";
import { OpenApiEditor } from "@apicurio-editors/ui/src/components/OpenApiEditor";
import { useMachine } from "@xstate/react";
import { appMachine } from "./AppMachine.tsx";
import { Loading } from "./components/Loading.tsx";
import { SpecUploader } from "./components/SpecUploader.tsx";

import { worker } from "./rpc.ts";

function App() {
  const [state, send] = useMachine(appMachine, { input: { spec: undefined } });
  console.log(state.value);

  switch (true) {
    case state.matches("idle"):
      return (
        <SpecUploader
          previousSpec={state.context.spec}
          onSpec={(content) => send({ type: "SPEC", content })}
        />
      );
    case state.matches("parsing"):
      return <Loading />;
    case state.matches("parsed"):
      return <OpenApiEditor getPaths={(filter) => worker.getPaths(filter)} />;
    default:
      return <>Unknown state: {state.value}</>;
  }
}

export default App;
