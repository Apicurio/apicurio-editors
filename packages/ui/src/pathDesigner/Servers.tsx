import { SearchableTable } from "../components/SearchableTable.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./PathDesignerMachineContext.ts";

export function Servers() {
  const { servers } = useMachineSelector(({ context }) => {
    return {
      servers: context.servers,
    };
  });
  const actorRef = useMachineActorRef();
  return (
    <SearchableTable
      data={servers}
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
