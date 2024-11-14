import { SourceEditor } from "../components/SourceEditor.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./CodeEditorMachineContext.ts";
import { NodeHeader } from "../components/NodeHeader.tsx";

export function CodeEditor() {
  const { isCloseable, source, title } = useMachineSelector((state) => {
    return {
      title: state.context.title,
      source: state.context.source,
      isCloseable: state.context.isCloseable,
    };
  });
  const actorRef = useMachineActorRef();
  return (
    <>
      <NodeHeader title={title} view={"code"} isClosable={isCloseable} />
      <SourceEditor
        source={source}
        onChangeSourceType={(source, sourceType) => {
          actorRef.send({
            type: "CHANGE_SOURCE_TYPE",
            source,
            sourceType,
          });
        }}
        onSave={(v) => console.log(v)}
      />
    </>
  );
}
