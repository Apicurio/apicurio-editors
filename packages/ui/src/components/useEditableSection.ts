import { useSection } from "./useSection.ts";

export function useEditableSection() {
  const view = useSection();
  return view === "designer";
}
