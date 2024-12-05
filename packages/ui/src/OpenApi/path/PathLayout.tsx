import { Section } from "../../components/Section.tsx";
import { ReactNode } from "react";
import { SectionSkeleton } from "../../components/SectionSkeleton.tsx";

export function PathLayout({
  info = <SectionSkeleton />,
  servers = <SectionSkeleton />,
}: {
  info?: ReactNode;
  servers?: ReactNode;
}) {
  return (
    <>
      <Section title={"Info"} id={"info"}>
        {info}
      </Section>
      <Section title={"Servers"} id={"servers"}>
        {servers}
      </Section>
    </>
  );
}
