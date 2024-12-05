import {
  Button,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { OmniSearch } from "./OmniSearch.tsx";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  RedoIcon,
  UndoIcon,
} from "@patternfly/react-icons";

export type EditorToolbarView = "design" | "code" | "hidden";
export type EditorToolbarProps = {
  mode: EditorToolbarView;
  canGoBack: boolean;
  onBack: () => void;
  canGoForward: boolean;
  onForward: () => void;
  onViewChange: (view: EditorToolbarView) => void;
  enableDesigner?: boolean;
  enableSource: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
};
export function EditorToolbar({
  mode,
  canGoBack,
  onBack,
  canGoForward,
  onForward,
  onViewChange,
  enableDesigner,
  enableSource,
  canRedo,
  canUndo,
  onRedo,
  onUndo,
}: EditorToolbarProps) {
  // const { low, medium, high } = OpenApiEditorMachineContext.useSelector(
  //   ({ context }) => {
  //     const groupedCount = groupBy(
  //       context.validationProblems,
  //       (v) => v.severity,
  //     );
  //     return {
  //       low: groupedCount["info"]?.length ?? 0,
  //       medium: groupedCount["warning"]?.length ?? 0,
  //       high: groupedCount["danger"]?.length ?? 0,
  //     };
  //   },
  // );
  return (
    <Toolbar className="pf-v6-u-p-0">
      <ToolbarContent>
        <ToolbarGroup className="pf-v6-u-flex-1">
          <ToolbarItem>
            <ToggleGroup aria-label="View selector">
              {enableDesigner && (
                <ToggleGroupItem
                  text="Design"
                  buttonId="toggle-designer"
                  isSelected={mode === "design"}
                  onChange={() => {
                    onViewChange("design");
                  }}
                  isDisabled={mode === "hidden"}
                />
              )}
              {enableSource && (
                <ToggleGroupItem
                  text="Source"
                  buttonId="toggle-yaml"
                  isSelected={mode === "code"}
                  onChange={() => {
                    onViewChange("code");
                  }}
                  isDisabled={mode === "hidden"}
                />
              )}
            </ToggleGroup>
          </ToolbarItem>
          {/*{low + medium + high > 0 && (*/}
          {/*  <>*/}
          {/*    <ToolbarItem alignSelf={"center"} variant={"label"}>*/}
          {/*      <Tooltip content={`${low + medium + high} errors`}>*/}
          {/*        <Button*/}
          {/*          variant={"plain"}*/}
          {/*          onClick={() => {*/}
          {/*            actorRef.send({*/}
          {/*              type: "SELECT_VALIDATION",*/}
          {/*            });*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          <LabelGroup>*/}
          {/*            {low !== 0 && (*/}
          {/*              <Label color={"blue"} icon={<InfoIcon />}>*/}
          {/*                {low}*/}
          {/*              </Label>*/}
          {/*            )}*/}
          {/*            {medium !== 0 && (*/}
          {/*              <Label color={"yellow"} icon={<WarningTriangleIcon />}>*/}
          {/*                {medium}*/}
          {/*              </Label>*/}
          {/*            )}*/}
          {/*            {high !== 0 && (*/}
          {/*              <Label color={"red"} icon={<ErrorCircleOIcon />}>*/}
          {/*                {high}*/}
          {/*              </Label>*/}
          {/*            )}*/}
          {/*          </LabelGroup>*/}
          {/*        </Button>*/}
          {/*      </Tooltip>*/}
          {/*    </ToolbarItem>*/}
          {/*  </>*/}
          {/*)}*/}
        </ToolbarGroup>
        <ToolbarGroup
          align={{ default: "alignEnd" }}
          variant={"action-group-plain"}
        >
          <ToolbarItem>
            <Button
              icon={<ArrowLeftIcon />}
              onClick={onBack}
              variant={"plain"}
              isDisabled={!canGoBack}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              icon={<ArrowRightIcon />}
              onClick={onForward}
              variant={"plain"}
              isDisabled={!canGoForward}
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup
          align={{ default: "alignCenter" }}
          className={"pf-v6-u-flex-1"}
        >
          <ToolbarItem className={"pf-v6-u-flex-1"}>
            <OmniSearch />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup
          align={{ lg: "alignEnd" }}
          className={"pf-v6-u-flex-1 pf-v6-u-justify-content-flex-end"}
          variant={"action-group-plain"}
        >
          <ToolbarItem>
            <Button
              variant={"plain"}
              isDisabled={!canUndo}
              onClick={onUndo}
              icon={<UndoIcon />}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button
              variant={"plain"}
              isDisabled={!canRedo}
              onClick={onRedo}
              icon={<RedoIcon />}
            />
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );
}
