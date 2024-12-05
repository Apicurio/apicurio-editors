import { Section } from "../../components/Section.tsx";
import { ReactNode } from "react";

export function DesignerLayout({ info }: { info: ReactNode }) {
  return (
    <>
      <Section title={"Info"} id={"info"}>
        {info}
      </Section>
    </>
  );
}
