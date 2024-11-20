import { SearchableTable } from "../components/SearchableTable.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./PathDesignerMachineContext.ts";
import { ServerRow } from "../components/ServerRow.tsx";

export function Servers() {
  const { servers, editable } = useMachineSelector(({ context }) => {
    return {
      servers: context.servers,
      editable: context.editable,
    };
  });
  const actorRef = useMachineActorRef();
  return (
    <SearchableTable
      label={"server"}
      data={servers}
      editing={editable}
      onFilter={(server, filter) =>
        server.url.toLowerCase().includes(filter.toLowerCase()) ||
        server.description.toLowerCase().includes(filter.toLowerCase())
      }
      onRenderRow={(server, idx) => (
        <ServerRow
          id={`server-${idx}`}
          url={server.url}
          editing={editable}
          description={server.description}
          onRemove={() => {}}
        />
      )}
      onAdd={function (): void {
        throw new Error("Function not implemented.");
      }}
      onRemoveAll={function (): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
