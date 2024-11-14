import { SectionSkeleton } from "../components/SectionSkeleton.tsx";
import { NodeHeader } from "../components/NodeHeader.tsx";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function DataTypeDesignerSkeleton() {
  return (
    <>
      <NodeHeader view={"designer"} isClosable={false} />
      <DesignerLayout info={<SectionSkeleton />} />
    </>
  );
}
