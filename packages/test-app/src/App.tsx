import "./App.css";
import { OpenApiEditor } from "@apicurio-editors/ui/src";
import { useMachine } from "@xstate/react";
import { Loading } from "../../ui/src/components/Loading.tsx";
import { appMachine } from "./AppMachine";
import { SpecUploader } from "./components/SpecUploader";

import { worker } from "./rpc.ts";

function App() {
  const [state, send] = useMachine(appMachine, { input: { spec: undefined } });

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
          getDocumentSnapshot={worker.getDocumentSnapshot}
          filterNavigation={worker.getDocumentNavigation}
          updateDocumentTitle={worker.updateDocumentTitle}
          updateDocumentVersion={worker.updateDocumentVersion}
          updateDocumentDescription={worker.updateDocumentDescription}
          updateDocumentContactName={worker.updateDocumentContactName}
          updateDocumentContactEmail={worker.updateDocumentContactEmail}
          updateDocumentContactUrl={worker.updateDocumentContactUrl}
          undo={worker.undoChange}
          redo={worker.redoChange}
        />
      );
    default:
      return <>Unknown state: {state.value}</>;
  }
}

export default App;
