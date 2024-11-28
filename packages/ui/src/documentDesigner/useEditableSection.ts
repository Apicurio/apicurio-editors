import { useMachineSelector } from "./DocumentDesignerMachineContext.ts";
import { useSection } from "../components/Section.tsx";

export function useEditableSection() {
  const { editable } = useMachineSelector(({ context }) => {
    return {
      editable: context.editable,
    };
  });
  const view = useSection();
  return view === "designer" || editable;
}
