import { Button } from "@patternfly/react-core";
import { RedoIcon, UndoIcon } from "@patternfly/react-icons";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

export function UndoRedo() {
  const { canUndo, canRedo } = OpenApiEditorMachineContext.useSelector(
    (state) => ({
      canUndo: state.context.canUndo,
      canRedo: state.context.canRedo,
    })
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <>
      <Button
        variant={"plain"}
        isDisabled={!canUndo}
        onClick={() => {
          actorRef.send({ type: "UNDO" });
        }}
      >
        <UndoIcon />
      </Button>
      <Button
        variant={"plain"}
        isDisabled={!canRedo}
        onClick={() => {
          actorRef.send({ type: "REDO" });
        }}
      >
        <RedoIcon />
      </Button>
    </>
  );
}
