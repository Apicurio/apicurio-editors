import { ReactNode } from "react";
import {
  Badge,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";

export function SidebarSection({
  title,
  addTooltip,
  count,
  onAdd,
  idx,
  children,
}: {
  title: ReactNode;
  addTooltip: string;
  footer: ReactNode;
  count?: number;
  onAdd: () => void;
  idx: number;
  children: ReactNode;
}) {
  const id = `sidebar-section-${idx}`;
  return (
    <>
      <Toolbar
        isSticky={true}
        style={{ top: 55 + 30 * idx, bottom: 60 * (idx - 1) }}
      >
        <ToolbarContent>
          <ToolbarItem alignSelf={"center"}>
            <Button href={`#${id}`} variant={"plain"} component={"a"}>
              {title}
            </Button>
          </ToolbarItem>
          <ToolbarGroup align={{ default: "alignEnd" }}>
            {count !== undefined && (
              <ToolbarItem alignSelf={"center"}>
                <Badge>{count}</Badge>
              </ToolbarItem>
            )}
            <ToolbarItem alignSelf={"center"}>
              <Tooltip content={addTooltip}>
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  aria-label={"add"}
                  icon={<PlusCircleIcon />}
                  onClick={onAdd}
                />
              </Tooltip>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
      <div style={{ position: "relative" }} className="pf-v6-u-py-md">
        <a id={id} style={{ top: -200, position: "absolute" }} />
        {children}
      </div>
    </>
  );
}
