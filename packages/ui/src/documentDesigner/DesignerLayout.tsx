import { Divider, Flex, JumpLinksItem } from "@patternfly/react-core";
import { Toc } from "../components/Toc.tsx";
import { TocContainer } from "../components/TocContainer.tsx";
import { Section } from "../components/Section.tsx";
import { ReactNode } from "react";
import { SectionSkeleton } from "../components/SectionSkeleton.tsx";

export function DesignerLayout({
  info = <SectionSkeleton />,
  paths = <SectionSkeleton />,
  contact = <SectionSkeleton />,
  license = <SectionSkeleton />,
  tagDefinitions = <SectionSkeleton />,
  servers = <SectionSkeleton />,
  securityScheme = <SectionSkeleton />,
  securityRequirements = <SectionSkeleton />,
  pathsCount,
  tagDefinitionsCount,
  serversCount,
  securitySchemeCount,
  securityRequirementsCount,
  onEdit,
}: {
  info?: ReactNode;
  paths?: ReactNode;
  contact?: ReactNode;
  license?: ReactNode;
  tagDefinitions?: ReactNode;
  servers?: ReactNode;
  securityScheme?: ReactNode;
  securityRequirements?: ReactNode;
  pathsCount?: number;
  tagDefinitionsCount?: number;
  serversCount?: number;
  securitySchemeCount?: number;
  securityRequirementsCount?: number;
  onEdit?: () => void;
}) {
  return (
    <Flex>
      <Toc>
        <JumpLinksItem href="#info">Info</JumpLinksItem>
        <JumpLinksItem href="#contact">Contact</JumpLinksItem>
        <JumpLinksItem href="#license">License</JumpLinksItem>
        <JumpLinksItem href="#paths">Paths</JumpLinksItem>
        <JumpLinksItem href="#tag-definitions">Tag definitions</JumpLinksItem>
        <JumpLinksItem href="#servers">Servers</JumpLinksItem>
        <JumpLinksItem href="#security-scheme">Security scheme</JumpLinksItem>
        <JumpLinksItem href="#security-requirements">
          Security requirements
        </JumpLinksItem>
      </Toc>
      <TocContainer>
        <Section title={"Info"} id={"info"} onEdit={onEdit}>
          {info}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section title={"Contact"} id={"contact"} onEdit={onEdit}>
          {contact}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section title={"License"} id={"license"} onEdit={onEdit}>
          {license}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section
          title={"Paths"}
          id={"paths"}
          count={pathsCount}
          onEdit={onEdit}
        >
          {paths}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section
          title={"Tag definitions"}
          count={tagDefinitionsCount}
          id={"tag-definitions"}
          onEdit={onEdit}
        >
          {tagDefinitions}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section
          title={"Servers"}
          count={serversCount}
          id={"servers"}
          onEdit={onEdit}
        >
          {servers}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section
          title={"Security scheme"}
          count={securitySchemeCount}
          id={"security-scheme"}
          onEdit={onEdit}
        >
          {securityScheme}
        </Section>
        <Divider inset={{ default: "insetNone" }} />
        <Section
          title={"Security requirements"}
          count={securityRequirementsCount}
          id={"security-requirements"}
          onEdit={onEdit}
        >
          {securityRequirements}
        </Section>
      </TocContainer>
    </Flex>
  );
}
