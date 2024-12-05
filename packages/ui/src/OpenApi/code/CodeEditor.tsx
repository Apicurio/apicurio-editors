import { SourceEditor } from "../../components/SourceEditor.tsx";
import {
  useOpenApiEditorMachineCodeRef,
  useOpenApiEditorMachineCodeSelector,
} from "../../useOpenApiEditorMachine.ts";

export function CodeEditor() {
  const { source, type } = useOpenApiEditorMachineCodeSelector((state) => {
    return {
      source: state.context.source,
      type: state.context.type,
    };
  });
  const actorRef = useOpenApiEditorMachineCodeRef();
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
