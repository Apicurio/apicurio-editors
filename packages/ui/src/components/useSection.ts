import { useContext } from "react";
import { SectionContext } from "./Section.tsx";

export function useSection() {
  return useContext(SectionContext).mode;
}
