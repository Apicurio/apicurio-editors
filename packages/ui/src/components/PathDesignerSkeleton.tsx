import {
  Flex,
  JumpLinksItem,
  PageSection,
  Skeleton,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Section } from "./Section.tsx";
import { EditorToolbar } from "./EditorToolbar.tsx";
import { SectionSkeleton } from "./SectionSkeleton.tsx";
import { Toc } from "./Toc.tsx";
import { TocContainer } from "./TocContainer.tsx";

export function PathDesignerSkeleton() {
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <>
      <PageSection stickyOnBreakpoint={{ default: "top" }}>
        <EditorToolbar
          view={"designer"}
          onViewChange={() => {
            actorRef.send({ type: "GO_TO_CODE_VIEW" });
          }}
        />
        <Skeleton />
      </PageSection>
      <Flex>
        <Toc>
          <JumpLinksItem href="#info">Info</JumpLinksItem>
        </Toc>
        <TocContainer>
          <Section title={"Info"} id={"info"}>
            <SectionSkeleton />
          </Section>
        </TocContainer>
      </Flex>
    </>
  );
}
