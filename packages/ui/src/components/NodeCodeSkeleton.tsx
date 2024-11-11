import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Loading } from "./Loading.tsx";
import { NodeHeader } from "./NodeHeader.tsx";

export function NodeCodeSkeleton() {
  const { title, isCloseable } = OpenApiEditorMachineContext.useSelector(
    (state) => {
      const title = (() => {
        switch (state.context.node.type) {
          case "root":
            return state.context.node.node.title;
          default:
            return state.context.node.path;
        }
      })();
      return {
        title,
        isCloseable: state.context.node.type !== "root",
      };
    }
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <>
      <NodeHeader
        title={title}
        view={"yaml"}
        isClosable={isCloseable}
        onViewChange={() => actorRef.send({ type: "GO_TO_DESIGNER_VIEW" })}
      />
      <Loading />
    </>
  );
}
