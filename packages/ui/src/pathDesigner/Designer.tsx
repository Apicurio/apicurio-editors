import { Toc } from "../components/Toc.tsx";
import { TocContainer } from "../components/TocContainer.tsx";
import { JumpLinksItem } from "@patternfly/react-core";
import { Section } from "../components/Section.tsx";
import { Info } from "./Info.tsx";
import { Servers } from "./Servers.tsx";
import { NodeHeader } from "../components/NodeHeader.tsx";
import { useMachineSelector } from "./PathDesignerMachineContext.ts";

export function Designer() {
  const { path } = useMachineSelector(({ context }) => {
    return {
      path: context.path,
      summary: context.summary,
      description: context.description,
    };
  });
  return (
    <>
      <NodeHeader title={path.path} view={"designer"} isClosable={true} />

      <Toc>
        <JumpLinksItem href="#info">Info</JumpLinksItem>
        <JumpLinksItem href="#servers">Servers</JumpLinksItem>
      </Toc>
      <TocContainer>
        <Section title={"Info"} id={"info"}>
          <Info />
        </Section>
        <Section title={"Servers"} id={"servers"}>
          <Servers />
        </Section>
      </TocContainer>
    </>
  );
}
