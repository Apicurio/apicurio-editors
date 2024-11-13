import { useSelector } from "@xstate/react";
import { DocumentDesignerMachine } from "./DocumentDesignerMachine.ts";
import { createContext, useContext } from "react";
import { ActorLogicFrom, ActorRefFrom, SnapshotFrom } from "xstate";

export const DocumentDesignerMachineContext = createContext<ActorRefFrom<
  typeof DocumentDesignerMachine
> | null>(null);

export function useMachineActorRef(): ActorRefFrom<
  typeof DocumentDesignerMachine
> {
  const actor = useContext(DocumentDesignerMachineContext);

  if (!actor) {
    throw new Error(`You used a hook from outside a MachineContext component.`);
  }

  return actor;
}

export function useMachineSelector<T>(
  selector: (
    snapshot: SnapshotFrom<ActorLogicFrom<typeof DocumentDesignerMachine>>
  ) => T,
  compare?: (a: T, b: T) => boolean
): T {
  const actor = useMachineActorRef();
  return useSelector(actor, selector, compare);
}
