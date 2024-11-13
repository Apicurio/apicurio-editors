import "./App.css";
import { OpenApiEditor } from "@apicurio-editors/ui/src";
import { useMachine } from "@xstate/react";
import { Loading } from "../../ui/src/components/Loading.tsx";
import { appMachine } from "./AppMachine.ts";
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
          getEditorState={worker.getEditorState}
          getDocumentRootSnapshot={worker.getDocumentRootSnapshot}
          getPathSnapshot={worker.getPathSnapshot}
          getDataTypeSnapshot={worker.getDataTypeSnapshot}
          getResponseSnapshot={worker.getResponseSnapshot}
          getNodeSource={worker.getNodeSource}
          getDocumentNavigation={worker.getDocumentNavigation}
          updateDocumentTitle={worker.updateDocumentTitle}
          updateDocumentVersion={worker.updateDocumentVersion}
          updateDocumentDescription={worker.updateDocumentDescription}
          updateDocumentContactName={worker.updateDocumentContactName}
          updateDocumentContactEmail={worker.updateDocumentContactEmail}
          updateDocumentContactUrl={worker.updateDocumentContactUrl}
          undoChange={worker.undoChange}
          redoChange={worker.redoChange}
        />
      );
    default:
      return <>Unknown state: {state.value}</>;
  }
}

export default App;
