import { SectionSkeleton } from "../components/SectionSkeleton.tsx";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function DataTypeDesignerSkeleton() {
  return <DesignerLayout info={<SectionSkeleton />} />;
}
