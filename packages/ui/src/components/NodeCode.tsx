import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { SourceEditor } from "./SourceEditor.tsx";
import { NodeHeader } from "./NodeHeader.tsx";

export function NodeCode() {
  const { title, source, isCloseable } =
    OpenApiEditorMachineContext.useSelector((state) => {
      let title = "";
      switch (state.context.node.type) {
        case "path":
        case "datatype":
        case "response":
          title = state.context.node.path;
          break;
        case "root":
          title = state.context.node.node.title;
          break;
      }
      return {
        title,
        isCloseable: state.context.node.type !== "root",
        source: state.context.source,
      };
    });
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <>
      <NodeHeader
        title={title}
        view={"yaml"}
        isClosable={isCloseable}
        onViewChange={() => actorRef.send({ type: "GO_TO_DESIGNER_VIEW" })}
      />
      <SourceEditor source={source!} onSave={(v) => console.log(v)} />
    </>
  );
}
