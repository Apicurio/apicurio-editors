import { PathLayout } from "./PathLayout.tsx";
import { Header } from "./Header.tsx";
import { Servers } from "./Servers.tsx";
import { useOpenApiEditorMachinePathSelector } from "../../useOpenApiEditorMachine.ts";
import { Info } from "./Info.tsx";
import { OperationsSections } from "./OperationsSections.tsx";

export function Path() {
  const isLoading = useOpenApiEditorMachinePathSelector(
    (state) => state.value === "loading",
  );

  switch (isLoading) {
    case true:
      return <PathLayout />;
    case false:
      return (
        <PathLayout
          header={<Header />}
          info={<Info />}
          operations={<OperationsSections />}
          servers={<Servers />}
        />
      );
  }
}
