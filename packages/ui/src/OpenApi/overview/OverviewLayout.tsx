import { Divider } from "@patternfly/react-core";
import { Section } from "../../components/Section.tsx";
import { ReactNode } from "react";
import { SectionSkeleton } from "../../components/SectionSkeleton.tsx";

export function OverviewLayout({
  information = <SectionSkeleton />,
  contact = <SectionSkeleton />,
  license = <SectionSkeleton />,
}: {
  information?: ReactNode;
  contact?: ReactNode;
  license?: ReactNode;
}) {
  return (
    <>
      <Section title={"Information"} id={"information"}>
        {information}
      </Section>
      <Divider inset={{ default: "insetNone" }} />
      <Section title={"Contact"} id={"contact"}>
        {contact}
      </Section>
      <Divider inset={{ default: "insetNone" }} />
      <Section title={"License"} id={"license"}>
        {license}
      </Section>
    </>
  );
}
