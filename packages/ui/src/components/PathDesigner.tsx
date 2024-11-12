import { SelectedNodeLayout } from "./SelectedNodeLayout.tsx";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Toc } from "./Toc.tsx";
import { TocContainer } from "./TocContainer.tsx";
import { JumpLinksItem } from "@patternfly/react-core";
import { Section } from "./Section.tsx";
import { PathInfo } from "./PathInfo.tsx";
import { PathServers } from "./PathServers.tsx";

export function PathDesigner() {
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <SelectedNodeLayout
      view={"designer"}
      onViewChange={() => actorRef.send({ type: "GO_TO_CODE_VIEW" })}
    >
      <Toc>
        <JumpLinksItem href="#info">Info</JumpLinksItem>
        <JumpLinksItem href="#servers">Servers</JumpLinksItem>
      </Toc>
      <TocContainer>
        <Section title={"Info"} id={"info"}>
          <PathInfo />
        </Section>
        <Section title={"Servers"} id={"servers"}>
          <PathServers />
        </Section>
      </TocContainer>
    </SelectedNodeLayout>
  );
}
