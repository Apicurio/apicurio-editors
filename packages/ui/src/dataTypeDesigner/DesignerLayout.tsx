import { Flex, JumpLinksItem } from "@patternfly/react-core";
import { Toc } from "../components/Toc.tsx";
import { TocContainer } from "../components/TocContainer.tsx";
import { Section } from "../components/Section.tsx";
import { ReactNode } from "react";
import { SectionSkeleton } from "../components/SectionSkeleton.tsx";

export function DesignerLayout({
  info = <SectionSkeleton />,
  properties = <SectionSkeleton />,
}: {
  info?: ReactNode;
  properties?: ReactNode;
}) {
  return (
    <Flex>
      <Toc>
        <JumpLinksItem href="#info">Info</JumpLinksItem>
        <JumpLinksItem href="#properties">Properties</JumpLinksItem>
      </Toc>
      <TocContainer>
        <Section title={"Info"} id={"info"}>
          {info}
        </Section>
        <Section title={"Properties"} id={"properties"}>
          {properties}
        </Section>
      </TocContainer>
    </Flex>
  );
}
