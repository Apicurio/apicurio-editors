import { useSection } from "../../components/useSection.ts";

export function useEditableSection() {
  const view = useSection();
  return view === "designer";
}
