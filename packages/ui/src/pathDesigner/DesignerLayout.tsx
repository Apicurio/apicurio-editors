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
