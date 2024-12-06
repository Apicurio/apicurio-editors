import { Section } from "../../components/Section.tsx";
import { ReactNode } from "react";
import { SectionSkeleton } from "../../components/SectionSkeleton.tsx";
import { PageSection, Skeleton } from "@patternfly/react-core";
import { Sections } from "../../components/Sections.tsx";

export function PathLayout({
  header = <Skeleton width={"55%"} />,
  info = <SectionSkeleton />,
  operations = <SectionSkeleton />,
  servers = <SectionSkeleton />,
}: {
  header?: ReactNode;
  info?: ReactNode;
  operations?: ReactNode;
  servers?: ReactNode;
}) {
  return (
    <Sections>
      <PageSection>{header}</PageSection>
      <Section title={"Info"} id={"info"}>
        {info}
      </Section>
      {operations}
      <Section title={"Servers"} id={"servers"}>
        {servers}
      </Section>
    </Sections>
  );
}
