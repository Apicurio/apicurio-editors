import { Divider, Flex, JumpLinksItem } from "@patternfly/react-core";
import { Toc } from "../components/Toc.tsx";
import { TocContainer } from "../components/TocContainer.tsx";
import { Section } from "../components/Section.tsx";
import { ReactNode } from "react";

export function DesignerLayout({
  info,
  contact,
  license,
  tagDefinitionsCount,
  tagDefinitions,
  serversCount,
  servers,
  securitySchemeCount,
  securityScheme,
  securityRequirementsCount,
  securityRequirements,
}: {
  info: ReactNode;
  contact: ReactNode;
  license: ReactNode;
  tagDefinitionsCount?: number;
  tagDefinitions: ReactNode;
  serversCount?: number;
  servers: ReactNode;
  securitySchemeCount?: number;
  securityScheme: ReactNode;
  securityRequirementsCount?: number;
  securityRequirements: ReactNode;
}) {
  return (
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
          {info}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section title={"Contact"} id={"contact"}>
          {contact}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section title={"License"} id={"license"}>
          {license}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section
          title={"Tag definitions"}
          count={tagDefinitionsCount}
          id={"tag-definitions"}
        >
          {tagDefinitions}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section title={"Servers"} count={serversCount} id={"servers"}>
          {servers}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section
          title={"Security scheme"}
          count={securitySchemeCount}
          id={"security-scheme"}
        >
          {securityScheme}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section
          title={"Security requirements"}
          count={securityRequirementsCount}
          id={"security-requirements"}
        >
          {securityRequirements}
        </Section>
      </TocContainer>
    </Flex>
  );
}
