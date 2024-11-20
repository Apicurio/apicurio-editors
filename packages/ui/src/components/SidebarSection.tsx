import { ReactNode } from "react";
import {
  Badge,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";

export function SidebarSection({
  title,
  count,
  idx,
  children,
}: {
  title: ReactNode;
  count?: number;
  idx: number;
  children: ReactNode;
}) {
  const id = `sidebar-section-${idx}`;
  return (
    <>
      <Toolbar
        isSticky={true}
        style={{ top: 0 + (30 * idx - 1), bottom: 60 * (idx - 1) }}
      >
        <ToolbarContent>
          <ToolbarItem alignSelf={"center"}>
            <Button href={`#${id}`} variant={"plain"} component={"a"}>
              {title}
            </Button>
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
