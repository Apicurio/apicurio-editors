import { useSelector } from "@xstate/react";
import { ResponseDesignerMachine } from "./ResponseDesignerMachine.ts";
import { createContext, useContext } from "react";
import { ActorLogicFrom, ActorRefFrom, SnapshotFrom } from "xstate";

export const ResponseDesignerMachineContext = createContext<ActorRefFrom<
  typeof ResponseDesignerMachine
> | null>(null);

export function useMachineActorRef(): ActorRefFrom<
  typeof ResponseDesignerMachine
> {
  const actor = useContext(ResponseDesignerMachineContext);

  if (!actor) {
    throw new Error(`You used a hook from outside a MachineContext component.`);
  }

  return actor;
}

export function useMachineSelector<T>(
  selector: (
    snapshot: SnapshotFrom<ActorLogicFrom<typeof ResponseDesignerMachine>>
  ) => T,
  compare?: (a: T, b: T) => boolean
): T {
  const actor = useMachineActorRef();
  return useSelector(actor, selector, compare);
}
