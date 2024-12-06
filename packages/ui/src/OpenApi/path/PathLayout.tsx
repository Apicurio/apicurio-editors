import { Section } from "../../components/Section.tsx";
import { ReactNode } from "react";
import { SectionSkeleton } from "../../components/SectionSkeleton.tsx";
import { Sections } from "../../components/Sections.tsx";
import { Skeleton } from "@patternfly/react-core";

export function PathLayout({
  title = <Skeleton width={"55%"} />,
  info = <SectionSkeleton />,
  operations = <SectionSkeleton />,
  servers = <SectionSkeleton />,
}: {
  title?: ReactNode;
  info?: ReactNode;
  operations?: ReactNode;
  servers?: ReactNode;
}) {
  return (
    <Sections>
      <Section title={title} id={"information"}>
        {info}
      </Section>
      {operations}
      <Section title={"Servers"} id={"servers"}>
        {servers}
      </Section>
    </Sections>
  );
}
