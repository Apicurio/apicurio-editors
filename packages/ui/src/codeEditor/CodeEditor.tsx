import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { SourceEditor } from "../components/SourceEditor.tsx";
import { useMachineSelector } from "./CodeEditorMachineContext.ts";
import { Loading } from "../components/Loading.tsx";
import { NodeHeader } from "../components/NodeHeader.tsx";

export function CodeEditor() {
  const { isLoading, isCloseable, source, title } = useMachineSelector(
    (state) => {
      return {
        isLoading: state.value === "loading",
        title: state.context.title,
        source: state.context.source,
        isCloseable: state.context.isCloseable,
      };
    }
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <>
      <NodeHeader title={title} view={"code"} isClosable={isCloseable} />
      {(() => {
        switch (isLoading) {
          case true:
            return <Loading />;
          case false:
            return (
              <SourceEditor source={source!} onSave={(v) => console.log(v)} />
            );
        }
      })()}
    </>
  );
}
