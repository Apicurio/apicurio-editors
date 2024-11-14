import { SectionSkeleton } from "../components/SectionSkeleton.tsx";
import { NodeHeader } from "../components/NodeHeader.tsx";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function DocumentDesignerSkeleton() {
  return (
    <>
      <NodeHeader view={"designer"} isClosable={false} />
      <DesignerLayout
        info={<SectionSkeleton />}
        contact={<SectionSkeleton />}
        license={<SectionSkeleton />}
        tagDefinitions={<SectionSkeleton />}
        servers={<SectionSkeleton />}
        securityScheme={<SectionSkeleton />}
        securityRequirements={<SectionSkeleton />}
      />
    </>
  );
}
