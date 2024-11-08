import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { SourceEditor } from "./SourceEditor.tsx";

export function DocumentRootEditor() {
  const { title, source } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => ({
      title: context.documentRoot.title,
      source: context.documentRoot.source,
    })
  );
  return (
    <SourceEditor
      title={title}
      source={source}
      onSave={(v) => console.log(v)}
    />
  );
}
