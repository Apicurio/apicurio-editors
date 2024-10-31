import "./App.css";
import { OpenApiEditor } from "@apicurio-editors/ui/src/components/OpenApiEditor";
import { useMachine } from "@xstate/react";
import { appMachine } from "./AppMachine";
import { Loading } from "./components/Loading";
import { SpecUploader } from "./components/SpecUploader";

import { worker } from "./rpc.ts";

function App() {
  const [state, send] = useMachine(appMachine, { input: { spec: undefined } });

  console.log(worker.getDocumentTitle());

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
      return (
        <OpenApiEditor
          getDocumentTitle={worker.getDocumentTitle}
          editDocumentTitle={worker.editDocumentTitle}
          getPaths={(filter) => worker.getPaths(filter)}
        />
      );
    default:
      return <>Unknown state: {state.value}</>;
  }
}

export default App;
