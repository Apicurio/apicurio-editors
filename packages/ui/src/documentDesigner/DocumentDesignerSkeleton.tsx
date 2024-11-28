import { SectionSkeleton } from "../components/SectionSkeleton.tsx";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function DocumentDesignerSkeleton() {
  return (
    <DesignerLayout
      overview={<SectionSkeleton />}
      contact={<SectionSkeleton />}
      license={<SectionSkeleton />}
      tagDefinitions={<SectionSkeleton />}
      servers={<SectionSkeleton />}
      securityScheme={<SectionSkeleton />}
      securityRequirements={<SectionSkeleton />}
    />
  );
}
