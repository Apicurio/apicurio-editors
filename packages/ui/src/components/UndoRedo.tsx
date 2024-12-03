import { Button } from "@patternfly/react-core";
import { RedoIcon, UndoIcon } from "@patternfly/react-icons";

export type UndoRedoProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
};
export function UndoRedo({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: UndoRedoProps): JSX.Element {
  return (
    <>
      <Button
        variant={"plain"}
        isDisabled={!canUndo}
        onClick={onUndo}
        icon={<UndoIcon />}
      />
      <Button
        variant={"plain"}
        isDisabled={!canRedo}
        onClick={onRedo}
        icon={<RedoIcon />}
      />
    </>
  );
}
