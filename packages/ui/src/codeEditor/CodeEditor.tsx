import { SourceEditor } from "../components/SourceEditor.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./CodeEditorMachineContext.ts";

export function CodeEditor() {
  const { source, type } = useMachineSelector((state) => {
    return {
      source: state.context.source,
      type: state.context.type,
    };
  });
  const actorRef = useMachineActorRef();
  return (
    <SourceEditor
      source={source}
      type={type}
      onChangeSourceType={(source, sourceType) => {
        actorRef.send({
          type: "CHANGE_SOURCE_TYPE",
          source,
          sourceType,
        });
      }}
      onSave={(v) => console.log(v)}
    />
  );
}
