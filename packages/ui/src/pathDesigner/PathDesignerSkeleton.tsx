import { Flex, JumpLinksItem, Skeleton } from "@patternfly/react-core";
import { Section } from "../components/Section.tsx";
import { SectionSkeleton } from "../components/SectionSkeleton.tsx";
import { Toc } from "../components/Toc.tsx";
import { TocContainer } from "../components/TocContainer.tsx";
import { NodeHeader } from "../components/NodeHeader.tsx";

export function PathDesignerSkeleton() {
  return (
    <>
      <NodeHeader title={<Skeleton />} view={"designer"} isClosable={false} />
      <Flex>
        <Toc>
          <JumpLinksItem href="#info">Info</JumpLinksItem>
          <JumpLinksItem href="#servers">Servers</JumpLinksItem>
        </Toc>
        <TocContainer>
          <Section title={"Info"} id={"info"}>
            <SectionSkeleton />
          </Section>
          <Section title={"Servers"} id={"servers"}>
            <SectionSkeleton />
          </Section>
        </TocContainer>
      </Flex>
    </>
  );
}
