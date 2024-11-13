import { useSelector } from "@xstate/react";
import { CodeEditorMachine } from "./CodeEditorMachine.ts";
import { createContext, useContext } from "react";
import { ActorLogicFrom, ActorRefFrom, SnapshotFrom } from "xstate";

export const CodeEditorMachineContext = createContext<ActorRefFrom<
  typeof CodeEditorMachine
> | null>(null);

export function useMachineActorRef(): ActorRefFrom<typeof CodeEditorMachine> {
  const actor = useContext(CodeEditorMachineContext);

  if (!actor) {
    throw new Error(`You used a hook from outside a MachineContext component.`);
  }

  return actor;
}

export function useMachineSelector<T>(
  selector: (
    snapshot: SnapshotFrom<ActorLogicFrom<typeof CodeEditorMachine>>
  ) => T,
  compare?: (a: T, b: T) => boolean
): T {
  const actor = useMachineActorRef();
  return useSelector(actor, selector, compare);
}
