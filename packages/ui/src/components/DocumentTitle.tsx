import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { InlineEdit } from "./InlineEdit.tsx";

export function DocumentTitle() {
  const title = OpenApiEditorMachineContext.useSelector(
    (state) => state.context.title
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <InlineEdit
      onChange={(title) => {
        actorRef.send({ type: "CHANGE_TITLE", title });
      }}
      value={title}
      validator={(value) => {
        if (!value || value.length === 0) {
          return { status: "error", errMessages: ["Title can't be empty"] };
        }
        return { status: "default", errMessages: [] };
      }}
    />
  );
}
