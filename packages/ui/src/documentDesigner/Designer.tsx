import { NodeHeader } from "../components/NodeHeader.tsx";
import { InlineEdit } from "../components/InlineEdit.tsx";
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
import { DesignerLayout } from "./DesignerLayout.tsx";

export function Designer() {
  const {
    title,
    tagDefinitionsCount,
    serversCount,
    securitySchemeCount,
    securityRequirementsCount,
  } = useMachineSelector(({ context }) => {
    return {
      title: context.title,
      tagDefinitionsCount: context.tags?.length,
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
      <DesignerLayout
        info={<Info />}
        contact={<Contact />}
        license={<License />}
        tagDefinitions={<TagDefinitions />}
        servers={<Servers />}
        securityScheme={<SecurityScheme />}
        securityRequirements={<SecurityRequirements />}
        tagDefinitionsCount={tagDefinitionsCount}
        serversCount={serversCount}
        securitySchemeCount={securitySchemeCount}
        securityRequirementsCount={securityRequirementsCount}
      />
    </>
  );
}
