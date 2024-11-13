import { Flex, JumpLinksItem, Skeleton } from "@patternfly/react-core";
import { Section } from "../components/Section.tsx";
import { SectionSkeleton } from "../components/SectionSkeleton.tsx";
import { Toc } from "../components/Toc.tsx";
import { TocContainer } from "../components/TocContainer.tsx";
import { NodeHeader } from "../components/NodeHeader.tsx";

export function DocumentDesignerSkeleton() {
  return (
    <>
      <NodeHeader title={<Skeleton />} view={"designer"} isClosable={false} />
      <Flex>
        <Toc>
          <JumpLinksItem href="#info">Info</JumpLinksItem>
          <JumpLinksItem href="#contact">Contact</JumpLinksItem>
          <JumpLinksItem href="#license">License</JumpLinksItem>
          <JumpLinksItem href="#tag-definitions">Tag definitions</JumpLinksItem>
          <JumpLinksItem href="#servers">Servers</JumpLinksItem>
          <JumpLinksItem href="#security-scheme">Security scheme</JumpLinksItem>
          <JumpLinksItem href="#security-requirements">
            Security requirements
          </JumpLinksItem>
        </Toc>
        <TocContainer>
          <Section title={"Info"} id={"info"}>
            <SectionSkeleton />
          </Section>
          <Section title={"Contact"} id={"contact"}>
            <SectionSkeleton />
          </Section>
          <Section title={"License"} id={"license"}>
            <SectionSkeleton />
          </Section>
          <Section title={"Tag definitions"} id={"tag-definitions"}>
            <SectionSkeleton />
          </Section>
          <Section title={"Servers"} id={"servers"}>
            <SectionSkeleton />
          </Section>
          <Section title={"Security scheme"} id={"security-scheme"}>
            <SectionSkeleton />
          </Section>
          <Section title={"Security requirements"} id={"security-requirements"}>
            <SectionSkeleton />
          </Section>
        </TocContainer>
      </Flex>
    </>
  );
}
