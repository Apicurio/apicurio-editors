import { Button, Title } from "@patternfly/react-core";
import { Section } from "../components/Section.tsx";
import { ReactNode } from "react";
import { SectionSkeleton } from "../components/SectionSkeleton.tsx";
import { ArrowLeftIcon } from "@patternfly/react-icons";

export function DesignerLayout({
  title,
  info = <SectionSkeleton />,
  properties = <SectionSkeleton />,
}: {
  title: string;
  info?: ReactNode;
  properties?: ReactNode;
}) {
  return (
    <>
      <div>
        <Button icon={<ArrowLeftIcon />} onClick={() => {}} variant={"plain"} />
        <Title headingLevel={"h1"} size={"lg"}>
          {title}{" "}
        </Title>
      </div>

      <Section title={"Info"} id={"info"}>
        {info}
      </Section>
      <Section title={"Properties"} id={"properties"}>
        {properties}
      </Section>
    </>
  );
}
