import { SectionSkeleton } from "../../components/SectionSkeleton.tsx";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function ResponseDesignerSkeleton() {
  return <DesignerLayout info={<SectionSkeleton />} />;
}
