import { Flex, JumpLinksItem } from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { DocumentRootContact } from "./DocumentRootContact.tsx";
import { DocumentRootInfo } from "./DocumentRootInfo.tsx";
import { DocumentRootLicense } from "./DocumentRootLicense.tsx";
import { DocumentRootTagDefinitions } from "./DocumentRootTagDefinitions.tsx";
import { Section } from "./Section.tsx";
import { InlineEdit } from "./InlineEdit.tsx";
import { DocumentServers } from "./DocumentServers.tsx";
import { DocumentRootSecurityRequirements } from "./DocumentRootSecurityRequirements.tsx";
import { DocumentRootSecurityScheme } from "./DocumentRootSecurityScheme.tsx";
import { NodeHeader } from "./NodeHeader.tsx";
import { Toc } from "./Toc.tsx";
import { TocContainer } from "./TocContainer.tsx";

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
            <DocumentRootInfo />
          </Section>
          <Section title={"Contact"} id={"contact"}>
            <DocumentRootContact />
          </Section>
          <Section title={"License"} id={"license"}>
            <DocumentRootLicense />
          </Section>
          <Section
            title={"Tag definitions"}
            count={tagsCount}
            id={"tag-definitions"}
          >
            <DocumentRootTagDefinitions />
          </Section>
          <Section title={"Servers"} count={serversCount} id={"servers"}>
            <DocumentServers />
          </Section>
          <Section
            title={"Security scheme"}
            count={securitySchemeCount}
            id={"security-scheme"}
          >
            <DocumentRootSecurityScheme />
          </Section>
          <Section
            title={"Security requirements"}
            count={securityRequirementsCount}
            id={"security-requirements"}
          >
            <DocumentRootSecurityRequirements />
          </Section>
        </TocContainer>
      </Flex>
    </>
  );
}
