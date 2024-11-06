import {
  Button,
  Label,
  LabelGroup,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { UndoRedo } from "./UndoRedo.tsx";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { groupBy } from "lodash";
import {
  ErrorCircleOIcon,
  InfoIcon,
  WarningTriangleIcon,
} from "@patternfly/react-icons";

export function EditorToolbar() {
  const { low, medium, high } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => {
      const groupedCount = groupBy(
        context.validationProblems,
        (v) => v.severity
      );
      console.log(groupedCount);
      return {
        low: groupedCount[1]?.length ?? 0,
        medium: groupedCount[2]?.length ?? 0,
        high: groupedCount[3]?.length ?? 0,
      };
    }
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem alignSelf={"center"} variant={"label"}>
          Issues&nbsp;
          <Button
            variant={"plain"}
            onClick={() => {
              actorRef.send({
                type: "SELECT_NODE",
                selectedNode: { type: "validation" },
              });
            }}
          >
            <LabelGroup>
              <Label color={"blue"} icon={<InfoIcon />}>
                {low}
              </Label>
              <Label color={"yellow"} icon={<WarningTriangleIcon />}>
                {medium}
              </Label>
              <Label color={"red"} icon={<ErrorCircleOIcon />}>
                {high}
              </Label>
            </LabelGroup>
          </Button>
        </ToolbarItem>
        <ToolbarItem variant="separator" />
        <ToolbarItem>
          <UndoRedo />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
}
