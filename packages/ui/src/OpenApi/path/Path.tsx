import { PathLayout } from "./PathLayout.tsx";
import { Info } from "./Info.tsx";
import { Servers } from "./Servers.tsx";
import { useOpenApiEditorMachinePathSelector } from "../../useOpenApiEditorMachine.ts";

export function Path() {
  const isLoading = useOpenApiEditorMachinePathSelector(
    (state) => state.value === "loading",
  );

  switch (isLoading) {
    case true:
      return <PathLayout />;
    case false:
      return <PathLayout info={<Info />} servers={<Servers />} />;
  }
}
