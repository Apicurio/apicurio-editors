import { Flex, JumpLinksItem } from "@patternfly/react-core";
import { Toc } from "../components/Toc.tsx";
import { TocContainer } from "../components/TocContainer.tsx";
import { Section } from "../components/Section.tsx";
import { ReactNode } from "react";

export function DesignerLayout({
  info,
  servers,
}: {
  info: ReactNode;
  servers: ReactNode;
}) {
  return (
    <Flex>
      <Toc>
        <JumpLinksItem href="#info">Info</JumpLinksItem>
        <JumpLinksItem href="#servers">Servers</JumpLinksItem>
      </Toc>
      <TocContainer>
        <Section title={"Info"} id={"info"}>
          {info}
        </Section>
        <Section title={"Servers"} id={"servers"}>
          {servers}
        </Section>
      </TocContainer>
    </Flex>
  );
}
