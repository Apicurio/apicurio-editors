import {
  Badge,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { UndoRedo } from "./UndoRedo.tsx";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

export function EditorToolbar() {
  const { validationMessagesCount } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => ({
      validationMessagesCount: context.validationProblems.length,
    })
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem alignSelf={"center"}>
          Issues <Badge>{validationMessagesCount}</Badge>
        </ToolbarItem>
        <ToolbarItem variant="separator" />
        <ToolbarItem>
          <UndoRedo />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
}
