import {
  Button,
  Label,
  LabelGroup,
  ToggleGroup,
  ToggleGroupItem,
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

type View = "designer" | "code" | "no-code";
export type EditorToolbarProps = {
  view: View;
  onViewChange: (view: View) => void;
};
export function EditorToolbar({ view, onViewChange }: EditorToolbarProps) {
  const { low, medium, high } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => {
      const groupedCount = groupBy(
        context.validationProblems,
        (v) => v.severity
      );
      return {
        low: groupedCount["info"]?.length ?? 0,
        medium: groupedCount["warning"]?.length ?? 0,
        high: groupedCount["danger"]?.length ?? 0,
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
                type: "SELECT_VALIDATION",
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
        {view !== "no-code" && (
          <ToolbarItem align={{ lg: "alignEnd" }}>
            <ToggleGroup aria-label="View selector">
              <ToggleGroupItem
                text="Design view"
                buttonId="toggle-designer"
                isSelected={view === "designer"}
                onChange={() => {
                  onViewChange("designer");
                }}
              />
              <ToggleGroupItem
                text="Source view"
                buttonId="toggle-yaml"
                isSelected={view === "code"}
                onChange={() => {
                  onViewChange("code");
                }}
              />
            </ToggleGroup>
          </ToolbarItem>
        )}
      </ToolbarContent>
    </Toolbar>
  );
}
