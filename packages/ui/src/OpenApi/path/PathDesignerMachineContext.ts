import { useSelector } from "@xstate/react";
import { PathMachine } from "./PathMachine.ts";
import { createContext, useContext } from "react";
import { ActorLogicFrom, ActorRefFrom, SnapshotFrom } from "xstate";

export const PathDesignerMachineContext = createContext<ActorRefFrom<
  typeof PathMachine
> | null>(null);

export function useMachineActorRef(): ActorRefFrom<typeof PathMachine> {
  const actor = useContext(PathDesignerMachineContext);

  if (!actor) {
    throw new Error(`You used a hook from outside a MachineContext component.`);
  }

  return actor;
}

export function useMachineSelector<T>(
  selector: (snapshot: SnapshotFrom<ActorLogicFrom<typeof PathMachine>>) => T,
  compare?: (a: T, b: T) => boolean,
): T {
  const actor = useMachineActorRef();
  return useSelector(actor, selector, compare);
}
