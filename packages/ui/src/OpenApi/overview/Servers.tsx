import { SearchableTable } from "../../components/SearchableTable.tsx";
import {
  useOpenApiEditorMachineOverviewRef,
  useOpenApiEditorMachineOverviewSelector,
} from "../../useOpenApiEditorMachine.ts";
import { ServerRow } from "../../components/ServerRow.tsx";
import { useEditableSection } from "./useEditableSection.ts";

export function Servers() {
  const { servers } = useOpenApiEditorMachineOverviewSelector(({ context }) => {
    return {
      servers: context.servers,
    };
  });
  const actorRef = useOpenApiEditorMachineOverviewRef();
  const isEditable = useEditableSection();
  return (
    <SearchableTable
      data={servers}
      label={"server"}
      editing={isEditable}
      onFilter={(server, filter) =>
        server.url.toLowerCase().includes(filter.toLowerCase()) ||
        server.description.toLowerCase().includes(filter.toLowerCase())
      }
      onRenderRow={(server, idx) => (
        <ServerRow
          id={`server-${idx}`}
          url={server.url}
          editing={isEditable}
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
