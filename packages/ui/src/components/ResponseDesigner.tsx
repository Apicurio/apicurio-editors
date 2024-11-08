import { SelectedNodeLayout } from "./SelectedNodeLayout.tsx";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

export function ResponseDesigner() {
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <SelectedNodeLayout
      view={"designer"}
      onViewChange={() => actorRef.send({ type: "GO_TO_YAML_VIEW" })}
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus,
      accusantium aperiam consequatur doloremque et, ex labore magni maiores
      modi molestiae quaerat sequi, velit voluptas. Doloribus eos fugiat quasi
      ratione sint.
    </SelectedNodeLayout>
  );
}
