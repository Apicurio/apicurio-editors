import { useSelector } from "@xstate/react";
import { OverviewMachine } from "./OpenApi/overview/OverviewMachine.ts";
import { ActorLogicFrom, ActorRefFrom, SnapshotFrom } from "xstate";
import { OpenApiEditorMachineContext } from "./OpenApiEditor.tsx";
import { CodeEditorMachine } from "./OpenApi/code/CodeEditorMachine.ts";
import { PathsMachine } from "./OpenApi/paths/PathsMachine.ts";
import { PathMachine } from "./OpenApi/path/PathMachine.ts";

export function useOpenApiEditorMachineOverviewRef(): ActorRefFrom<
  typeof OverviewMachine
> {
  const editorRef = OpenApiEditorMachineContext.useActorRef();
  return editorRef.system.get("overview") as ActorRefFrom<
    typeof OverviewMachine
  >;
}

export function useOpenApiEditorMachineOverviewSelector<T>(
  selector: (
    snapshot: SnapshotFrom<ActorLogicFrom<typeof OverviewMachine>>,
  ) => T,
  compare?: (a: T, b: T) => boolean,
): T {
  const actor = useOpenApiEditorMachineOverviewRef();
  return useSelector(actor, selector, compare);
}

export function useOpenApiEditorMachineCodeRef(): ActorRefFrom<
  typeof CodeEditorMachine
> {
  const editorRef = OpenApiEditorMachineContext.useActorRef();
  return editorRef.system.get("code") as ActorRefFrom<typeof CodeEditorMachine>;
}

export function useOpenApiEditorMachineCodeSelector<T>(
  selector: (
    snapshot: SnapshotFrom<ActorLogicFrom<typeof CodeEditorMachine>>,
  ) => T,
  compare?: (a: T, b: T) => boolean,
): T {
  const actor = useOpenApiEditorMachineCodeRef();
  return useSelector(actor, selector, compare);
}

export function useOpenApiEditorMachinePathsRef(): ActorRefFrom<
  typeof PathsMachine
> {
  const editorRef = OpenApiEditorMachineContext.useActorRef();
  return editorRef.system.get("paths") as ActorRefFrom<typeof PathsMachine>;
}

export function useOpenApiEditorMachinePathsSelector<T>(
  selector: (snapshot: SnapshotFrom<ActorLogicFrom<typeof PathsMachine>>) => T,
  compare?: (a: T, b: T) => boolean,
): T {
  const actor = useOpenApiEditorMachinePathsRef();
  return useSelector(actor, selector, compare);
}

export function useOpenApiEditorMachinePathRef(): ActorRefFrom<
  typeof PathMachine
> {
  const editorRef = OpenApiEditorMachineContext.useActorRef();
  return editorRef.system.get("path") as ActorRefFrom<typeof PathMachine>;
}

export function useOpenApiEditorMachinePathSelector<T>(
  selector: (snapshot: SnapshotFrom<ActorLogicFrom<typeof PathMachine>>) => T,
  compare?: (a: T, b: T) => boolean,
): T {
  const actor = useOpenApiEditorMachinePathRef();
  return useSelector(actor, selector, compare);
}
