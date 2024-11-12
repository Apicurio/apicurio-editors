import { SelectedNodeLayout } from "./SelectedNodeLayout.tsx";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

export function DataTypeDesigner() {
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <SelectedNodeLayout
      view={"designer"}
      onViewChange={() => actorRef.send({ type: "GO_TO_CODE_VIEW" })}
    >
      lorem ipsum dolor sit amet
    </SelectedNodeLayout>
  );
}
