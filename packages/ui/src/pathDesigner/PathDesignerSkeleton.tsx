import { SectionSkeleton } from "../components/SectionSkeleton.tsx";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function PathDesignerSkeleton() {
  return (
    <DesignerLayout info={<SectionSkeleton />} servers={<SectionSkeleton />} />
  );
}
