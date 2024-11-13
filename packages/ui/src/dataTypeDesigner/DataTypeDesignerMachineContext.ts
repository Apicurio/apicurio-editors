import { useSelector } from "@xstate/react";
import { DataTypeDesignerMachine } from "./DataTypeDesignerMachine.ts";
import { createContext, useContext } from "react";
import { ActorLogicFrom, ActorRefFrom, SnapshotFrom } from "xstate";

export const DataTypeDesignerMachineContext = createContext<ActorRefFrom<
  typeof DataTypeDesignerMachine
> | null>(null);

export function useMachineActorRef(): ActorRefFrom<
  typeof DataTypeDesignerMachine
> {
  const actor = useContext(DataTypeDesignerMachineContext);

  if (!actor) {
    throw new Error(`You used a hook from outside a MachineContext component.`);
  }

  return actor;
}

export function useMachineSelector<T>(
  selector: (
    snapshot: SnapshotFrom<ActorLogicFrom<typeof DataTypeDesignerMachine>>
  ) => T,
  compare?: (a: T, b: T) => boolean
): T {
  const actor = useMachineActorRef();
  return useSelector(actor, selector, compare);
}
