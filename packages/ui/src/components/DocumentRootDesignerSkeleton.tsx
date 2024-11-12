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

export function DocumentRootDesignerSkeleton() {
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
          <JumpLinksItem href="#contact">Contact</JumpLinksItem>
          <JumpLinksItem href="#license">License</JumpLinksItem>
          <JumpLinksItem href="#tag-definitions">Tag definitions</JumpLinksItem>
          <JumpLinksItem href="#servers">Servers</JumpLinksItem>
          <JumpLinksItem href="#security-scheme">Security scheme</JumpLinksItem>
          <JumpLinksItem href="#security-requirements">
            Security requirements
          </JumpLinksItem>
        </Toc>
        <TocContainer>
          <Section title={"Info"} id={"info"}>
            <SectionSkeleton />
          </Section>
          <Section title={"Contact"} id={"contact"}>
            <SectionSkeleton />
          </Section>
          <Section title={"License"} id={"license"}>
            <SectionSkeleton />
          </Section>
          <Section title={"Tag definitions"} id={"tag-definitions"}>
            <SectionSkeleton />
          </Section>
          <Section title={"Servers"} id={"servers"}>
            <SectionSkeleton />
          </Section>
          <Section title={"Security scheme"} id={"security-scheme"}>
            <SectionSkeleton />
          </Section>
          <Section title={"Security requirements"} id={"security-requirements"}>
            <SectionSkeleton />
          </Section>
        </TocContainer>
      </Flex>
    </>
  );
}
