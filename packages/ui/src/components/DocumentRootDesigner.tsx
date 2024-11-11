import {
  Flex,
  JumpLinks,
  JumpLinksItem,
  JumpLinksList,
  Stack,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Contact } from "./Contact.tsx";
import { Info } from "./Info.tsx";
import { DocumentLicense } from "./DocumentLicense.tsx";
import { DocumentTagDefinitions } from "./DocumentTagDefinitions.tsx";
import { DocumentSection } from "./DocumentSection.tsx";
import { InlineEdit } from "./InlineEdit.tsx";
import classes from "./Toc.module.css";
import { DocumentServers } from "./DocumentServers.tsx";
import { DocumentSecurityRequirements } from "./DocumentSecurityRequirements.tsx";
import { DocumentSecurityScheme } from "./DocumentSecurityScheme.tsx";
import { NodeHeader } from "./NodeHeader.tsx";

export function DocumentRootDesigner() {
  const {
    title,
    tagsCount,
    serversCount,
    securitySchemeCount,
    securityRequirementsCount,
  } = OpenApiEditorMachineContext.useSelector(({ context }) => {
    if (context.node.type !== "root") throw new Error("Invalid node type");
    return {
      title: context.node.node.title,
      tagsCount: context.node.node.tags?.length,
      serversCount: context.node.node.servers?.length,
      securitySchemeCount: context.node.node.securityScheme?.length,
      securityRequirementsCount: context.node.node.securityRequirements?.length,
    };
  });
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <>
      <NodeHeader
        title={
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
        }
        view={"designer"}
        onViewChange={() => {
          actorRef.send({ type: "GO_TO_CODE_VIEW" });
        }}
        isClosable={false}
      />
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
            <DocumentLicense />
          </DocumentSection>
          <DocumentSection
            title={"Tag definitions"}
            count={tagsCount}
            id={"tag-definitions"}
          >
            <DocumentTagDefinitions />
          </DocumentSection>
          <DocumentSection
            title={"Servers"}
            count={serversCount}
            id={"servers"}
          >
            <DocumentServers />
          </DocumentSection>
          <DocumentSection
            title={"Security scheme"}
            count={securitySchemeCount}
            id={"security-scheme"}
          >
            <DocumentSecurityScheme />
          </DocumentSection>
          <DocumentSection
            title={"Security requirements"}
            count={securityRequirementsCount}
            id={"security-requirements"}
          >
            <DocumentSecurityRequirements />
          </DocumentSection>
        </Stack>
      </Flex>
    </>
  );
}
