import { useSelector } from "@xstate/react";
import { PathsDesignerMachine } from "./PathsDesignerMachine.ts";
import { createContext, useContext } from "react";
import { ActorLogicFrom, ActorRefFrom, SnapshotFrom } from "xstate";

export const PathsDesignerMachineContext = createContext<ActorRefFrom<
  typeof PathsDesignerMachine
> | null>(null);

export function useMachineActorRef(): ActorRefFrom<
  typeof PathsDesignerMachine
> {
  const actor = useContext(PathsDesignerMachineContext);

  if (!actor) {
    throw new Error(`You used a hook from outside a MachineContext component.`);
  }

  return actor;
}

export function useMachineSelector<T>(
  selector: (
    snapshot: SnapshotFrom<ActorLogicFrom<typeof PathsDesignerMachine>>,
  ) => T,
  compare?: (a: T, b: T) => boolean,
): T {
  const actor = useMachineActorRef();
  return useSelector(actor, selector, compare);
}
