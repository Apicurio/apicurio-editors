import {
  Flex,
  JumpLinks,
  JumpLinksItem,
  JumpLinksList,
  PageSection,
  Stack,
  Title,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Contact } from "./Contact.tsx";
import { Info } from "./Info.tsx";
import { License } from "./License.tsx";
import { TagDefinitions } from "./TagDefinitions.tsx";
import { DocumentSection } from "./DocumentSection.tsx";
import { InlineEdit } from "./InlineEdit.tsx";
import { EditorToolbar } from "./EditorToolbar.tsx";
import classes from "./Toc.module.css";
import { Servers } from "./Servers.tsx";
import { SecurityRequirements } from "./SecurityRequirements.tsx";
import { SecurityScheme } from "./SecuritySchemes.tsx";

export function DocumentRootDesigner() {
  const {
    title,
    tagsCount,
    serversCount,
    securitySchemeCount,
    securityRequirementsCount,
  } = OpenApiEditorMachineContext.useSelector(({ context }) => ({
    title: context.documentRoot.title,
    tagsCount: context.documentRoot.tags?.length,
    serversCount: context.documentRoot.servers?.length,
    securitySchemeCount: context.documentRoot.securityScheme?.length,
    securityRequirementsCount:
      context.documentRoot.securityRequirements?.length,
  }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <>
      <PageSection stickyOnBreakpoint={{ default: "top" }}>
        <EditorToolbar
          view={"designer"}
          onViewChange={() => {
            actorRef.send({ type: "GO_TO_YAML_VIEW" });
          }}
        />
        <Title headingLevel={"h1"}>
          <InlineEdit
            onChange={(title) => {
              actorRef.send({ type: "CHANGE_TITLE", title });
            }}
            value={title}
            validator={(value) => {
              if (!value || value.length === 0) {
                return {
                  status: "error",
                  errMessages: ["Title can't be empty"],
                };
              }
              return { status: "default", errMessages: [] };
            }}
          />
        </Title>
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
            <Info />
          </DocumentSection>
          <DocumentSection title={"Contact"} id={"contact"}>
            <Contact />
          </DocumentSection>
          <DocumentSection title={"License"} id={"license"}>
            <License />
          </DocumentSection>
          <DocumentSection
            title={"Tag definitions"}
            count={tagsCount}
            id={"tag-definitions"}
          >
            <TagDefinitions />
          </DocumentSection>
          <DocumentSection
            title={"Servers"}
            count={serversCount}
            id={"servers"}
          >
            <Servers />
          </DocumentSection>
          <DocumentSection
            title={"Security scheme"}
            count={securitySchemeCount}
            id={"security-scheme"}
          >
            <SecurityScheme />
          </DocumentSection>
          <DocumentSection
            title={"Security requirements"}
            count={securityRequirementsCount}
            id={"security-requirements"}
          >
            <SecurityRequirements />
          </DocumentSection>
        </Stack>
      </Flex>
    </>
  );
}
