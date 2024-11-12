import { SelectedNodeLayout } from "./SelectedNodeLayout.tsx";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Toc } from "./Toc.tsx";
import { TocContainer } from "./TocContainer.tsx";
import { JumpLinksItem } from "@patternfly/react-core";
import { Section } from "./Section.tsx";
import { PathInfo } from "./PathInfo.tsx";

export function PathDesigner() {
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <SelectedNodeLayout
      view={"designer"}
      onViewChange={() => actorRef.send({ type: "GO_TO_CODE_VIEW" })}
    >
      <Toc>
        <JumpLinksItem href="#info">Info</JumpLinksItem>
      </Toc>
      <TocContainer>
        <Section title={"Info"} id={"info"}>
          <PathInfo />
        </Section>
      </TocContainer>
    </SelectedNodeLayout>
  );
}
