import {
  Button,
  Label,
  LabelGroup,
  Title,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from "@patternfly/react-core";
import { UndoRedo } from "./UndoRedo.tsx";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { groupBy } from "lodash";
import {
  ArrowLeftIcon,
  ErrorCircleOIcon,
  InfoIcon,
  WarningTriangleIcon,
} from "@patternfly/react-icons";
import { ReactNode } from "react";

type View = "designer" | "code" | "no-code";
export type EditorToolbarProps = {
  title: ReactNode;
  label?: ReactNode;
  view: View;
  canGoBack: boolean;
  onBack: () => void;
  onViewChange: (view: View) => void;
};
export function EditorToolbar({
  title,
  label,
  view,
  canGoBack,
  onBack,
  onViewChange,
}: EditorToolbarProps) {
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
    <Toolbar className="pf-v6-u-p-0">
      <ToolbarContent>
        {canGoBack && (
          <ToolbarItem>
            <Button
              icon={<ArrowLeftIcon />}
              onClick={onBack}
              variant={"plain"}
            />
          </ToolbarItem>
        )}
        {label && <ToolbarItem alignSelf={"center"}>{label}</ToolbarItem>}
        <ToolbarItem style={{ flex: "1" }} alignSelf={"center"}>
          <Title headingLevel={"h1"} size={"lg"}>
            {title}
          </Title>
        </ToolbarItem>
        {low + medium + high > 0 && (
          <>
            <ToolbarItem alignSelf={"center"} variant={"label"}>
              <Tooltip content={`${low + medium + high} errors`}>
                <Button
                  variant={"plain"}
                  onClick={() => {
                    actorRef.send({
                      type: "SELECT_VALIDATION",
                    });
                  }}
                >
                  <LabelGroup>
                    {low !== 0 && (
                      <Label color={"blue"} icon={<InfoIcon />}>
                        {low}
                      </Label>
                    )}
                    {medium !== 0 && (
                      <Label color={"yellow"} icon={<WarningTriangleIcon />}>
                        {medium}
                      </Label>
                    )}
                    {high !== 0 && (
                      <Label color={"red"} icon={<ErrorCircleOIcon />}>
                        {high}
                      </Label>
                    )}
                  </LabelGroup>
                </Button>
              </Tooltip>
            </ToolbarItem>
          </>
        )}
        <ToolbarGroup align={{ lg: "alignEnd" }} style={{ maxWidth: "50%" }}>
          <ToolbarItem>
            <UndoRedo />
          </ToolbarItem>
          {view !== "no-code" && (
            <>
              <ToolbarItem variant={"separator"} />

              <ToolbarItem>
                <ToggleGroup aria-label="View selector">
                  <ToggleGroupItem
                    text="Designer"
                    buttonId="toggle-designer"
                    isSelected={view === "designer"}
                    onChange={() => {
                      onViewChange("designer");
                    }}
                  />
                  <ToggleGroupItem
                    text="Editor"
                    buttonId="toggle-yaml"
                    isSelected={view === "code"}
                    onChange={() => {
                      onViewChange("code");
                    }}
                  />
                </ToggleGroup>
              </ToolbarItem>
            </>
          )}
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
}
