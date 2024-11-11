import {
  Flex,
  JumpLinks,
  JumpLinksItem,
  JumpLinksList,
  PageSection,
  Skeleton,
  Stack,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { DocumentSection } from "./DocumentSection.tsx";
import { EditorToolbar } from "./EditorToolbar.tsx";
import classes from "./Toc.module.css";
import { DocumentSectionSkeleton } from "./DocumentSectionSkeleton.tsx";

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
        <JumpLinks
          className={classes.toc}
          scrollableSelector={".apicurio-editor .pf-v6-c-drawer__panel-main"}
          isVertical={true}
          expandable={{ default: "expandable", "2xl": "nonExpandable" }}
          label={"Table of contents"}
          offset={177}
          style={{ top: 127 }}
        >
          <JumpLinksList>
            <JumpLinksItem href="#info">Info</JumpLinksItem>
            <JumpLinksItem href="#contact">Contact</JumpLinksItem>
            <JumpLinksItem href="#license">License</JumpLinksItem>
            <JumpLinksItem href="#tag-definitions">
              Tag definitions
            </JumpLinksItem>
            <JumpLinksItem href="#servers">Servers</JumpLinksItem>
            <JumpLinksItem href="#security-scheme">
              Security scheme
            </JumpLinksItem>
            <JumpLinksItem href="#security-requirements">
              Security requirements
            </JumpLinksItem>
          </JumpLinksList>
        </JumpLinks>
        <Stack hasGutter={true} className={classes.content}>
          <DocumentSection title={"Info"} id={"info"}>
            <DocumentSectionSkeleton />
          </DocumentSection>
          <DocumentSection title={"Contact"} id={"contact"}>
            <DocumentSectionSkeleton />
          </DocumentSection>
          <DocumentSection title={"License"} id={"license"}>
            <DocumentSectionSkeleton />
          </DocumentSection>
          <DocumentSection title={"Tag definitions"} id={"tag-definitions"}>
            <DocumentSectionSkeleton />
          </DocumentSection>
          <DocumentSection title={"Servers"} id={"servers"}>
            <DocumentSectionSkeleton />
          </DocumentSection>
          <DocumentSection title={"Security scheme"} id={"security-scheme"}>
            <DocumentSectionSkeleton />
          </DocumentSection>
          <DocumentSection
            title={"Security requirements"}
            id={"security-requirements"}
          >
            <DocumentSectionSkeleton />
          </DocumentSection>
        </Stack>
      </Flex>
    </>
  );
}
