import { Overview } from "./Overview.tsx";
import { Contact } from "./Contact.tsx";
import { License } from "./License.tsx";
import { TagDefinitions } from "./TagDefinitions.tsx";
import { Servers } from "./Servers.tsx";
import { SecurityScheme } from "./SecurityScheme.tsx";
import { SecurityRequirements } from "./SecurityRequirements.tsx";
import { useMachineSelector } from "./DocumentDesignerMachineContext.ts";
import { DesignerLayout } from "./DesignerLayout.tsx";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Paths } from "./Paths.tsx";

export function Designer() {
  const {
    tagDefinitionsCount,
    serversCount,
    securitySchemeCount,
    securityRequirementsCount,
    pathsCount,
    editable,
  } = useMachineSelector(({ context }) => {
    return {
      tagDefinitionsCount: context.tags?.length,
      serversCount: context.servers?.length,
      securitySchemeCount: context.securityScheme?.length,
      securityRequirementsCount: context.securityRequirements?.length,
      pathsCount: context.paths?.length,
      editable: context.editable,
    };
  });
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const onEdit = !editable
    ? () => {
        actorRef.send({ type: "SELECT_DOCUMENT_ROOT_DESIGNER" });
      }
    : undefined;
  return (
    <DesignerLayout
      overview={<Overview />}
      paths={<Paths />}
      pathsCount={pathsCount}
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
      onEdit={onEdit}
    />
  );
}
