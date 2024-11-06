import "./App.css";
import { OpenApiEditor } from "@apicurio-editors/ui/src";
import { useMachine } from "@xstate/react";
import { Loading } from "../../ui/src/components/Loading.tsx";
import { appMachine } from "./AppMachine.ts";
import { SpecUploader } from "./components/SpecUploader";

import { worker } from "./rpc.ts";
import { useLayoutEffect } from "react";

function App() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document
        .getElementsByTagName("html")[0]
        .classList.add("pf-v6-theme-dark");
    }
  }, []);
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
