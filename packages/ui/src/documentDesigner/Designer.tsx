import { Info } from "./Info.tsx";
import { Contact } from "./Contact.tsx";
import { License } from "./License.tsx";
import { TagDefinitions } from "./TagDefinitions.tsx";
import { Servers } from "./Servers.tsx";
import { SecurityScheme } from "./SecurityScheme.tsx";
import { SecurityRequirements } from "./SecurityRequirements.tsx";
import { useMachineSelector } from "./DocumentDesignerMachineContext.ts";
import { DesignerLayout } from "./DesignerLayout.tsx";
import { PathsExplorer } from "./PathsExplorer.tsx";
import { PathsTree } from "./PathsTree.tsx";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

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
      info={<Info />}
      paths={editable ? <PathsTree /> : <PathsExplorer />}
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
