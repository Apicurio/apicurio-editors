import { Info } from "./Info.tsx";
import { Contact } from "./Contact.tsx";
import { License } from "./License.tsx";
import { TagDefinitions } from "./TagDefinitions.tsx";
import { Servers } from "./Servers.tsx";
import { SecurityScheme } from "./SecurityScheme.tsx";
import { SecurityRequirements } from "./SecurityRequirements.tsx";
import { useMachineSelector } from "./DocumentDesignerMachineContext.ts";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function Designer() {
  const {
    tagDefinitionsCount,
    serversCount,
    securitySchemeCount,
    securityRequirementsCount,
  } = useMachineSelector(({ context }) => {
    return {
      tagDefinitionsCount: context.tags?.length,
      serversCount: context.servers?.length,
      securitySchemeCount: context.securityScheme?.length,
      securityRequirementsCount: context.securityRequirements?.length,
    };
  });
  return (
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
  );
}
