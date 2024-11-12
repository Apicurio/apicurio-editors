import { ReactNode } from "react";
import {
  Badge,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { PlusCircleIcon } from "@patternfly/react-icons";

export function SidebarSection({
  title,
  count,
  onAdd,
  idx,
  children,
}: {
  title: ReactNode;
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
          <ToolbarItem alignSelf={"center"}>
            <Button
              variant={"control"}
              size={"sm"}
              aria-label={"add"}
              icon={<PlusCircleIcon />}
              onClick={onAdd}
            />
          </ToolbarItem>
          {count !== undefined && (
            <ToolbarItem alignSelf={"center"} align={{ default: "alignEnd" }}>
              <Badge>{count}</Badge>
            </ToolbarItem>
          )}
        </ToolbarContent>
      </Toolbar>
      <div style={{ position: "relative" }} className="pf-v6-u-py-md">
        <a id={id} style={{ top: -200, position: "absolute" }} />
        {children}
      </div>
    </>
  );
}
