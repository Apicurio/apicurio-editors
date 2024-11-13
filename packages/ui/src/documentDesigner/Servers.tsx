import { ServersTable } from "../components/ServersTable.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./DocumentDesignerMachineContext.ts";

export function Servers() {
  const { servers } = useMachineSelector(({ context }) => {
    return {
      servers: context.servers,
    };
  });
  const actorRef = useMachineActorRef();
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
