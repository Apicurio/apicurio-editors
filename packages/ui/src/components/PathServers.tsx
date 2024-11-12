import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { ServersTable } from "./ServersTable.tsx";

export function PathServers() {
  const { servers } = OpenApiEditorMachineContext.useSelector(({ context }) => {
    if (context.node.type !== "path") throw new Error("Invalid node type");
    return {
      servers: context.node.node.servers,
    };
  });
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <ServersTable
      servers={servers}
      onAdd={function (): void {
        throw new Error("Function not implemented.");
      }}
      onRename={function (id: string): void {
        throw new Error("Function not implemented.");
      }}
      onRemove={function (id: string): void {
        throw new Error("Function not implemented.");
      }}
      onRemoveAll={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
