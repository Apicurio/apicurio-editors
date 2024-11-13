import { NodeHeader } from "../components/NodeHeader.tsx";
import { InlineEdit } from "../components/InlineEdit.tsx";
import { Flex, JumpLinksItem } from "@patternfly/react-core";
import { Toc } from "../components/Toc.tsx";
import { TocContainer } from "../components/TocContainer.tsx";
import { Section } from "../components/Section.tsx";
import { Info } from "./Info.tsx";
import { Contact } from "./Contact.tsx";
import { License } from "./License.tsx";
import { TagDefinitions } from "./TagDefinitions.tsx";
import { Servers } from "./Servers.tsx";
import { SecurityScheme } from "./SecurityScheme.tsx";
import { SecurityRequirements } from "./SecurityRequirements.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./DocumentDesignerMachineContext.ts";

export function Designer() {
  const {
    title,
    tagsCount,
    serversCount,
    securitySchemeCount,
    securityRequirementsCount,
  } = useMachineSelector(({ context }) => {
    return {
      title: context.title,
      tagsCount: context.tags?.length,
      serversCount: context.servers?.length,
      securitySchemeCount: context.securityScheme?.length,
      securityRequirementsCount: context.securityRequirements?.length,
    };
  });
  const actorRef = useMachineActorRef();
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
            <Info />
          </Section>
          <Section title={"Contact"} id={"contact"}>
            <Contact />
          </Section>
          <Section title={"License"} id={"license"}>
            <License />
          </Section>
          <Section
            title={"Tag definitions"}
            count={tagsCount}
            id={"tag-definitions"}
          >
            <TagDefinitions />
          </Section>
          <Section title={"Servers"} count={serversCount} id={"servers"}>
            <Servers />
          </Section>
          <Section
            title={"Security scheme"}
            count={securitySchemeCount}
            id={"security-scheme"}
          >
            <SecurityScheme />
          </Section>
          <Section
            title={"Security requirements"}
            count={securityRequirementsCount}
            id={"security-requirements"}
          >
            <SecurityRequirements />
          </Section>
        </TocContainer>
      </Flex>
    </>
  );
}
