import { useMachineSelector } from "./DataTypeDesignerMachineContext";

import { useSection } from "../components/useSection.ts";

export function useEditableSection() {
  const { editable } = useMachineSelector(({ context }) => {
    return {
      editable: context.editable,
    };
  });
  const view = useSection();
  return view === "designer" || editable;
}
