import { ReactNode } from "react";
import {
  Badge,
  Button,
  Card,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { AddCircleOIcon } from "@patternfly/react-icons";

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
          {count !== undefined && (
            <ToolbarItem alignSelf={"center"}>
              <Badge>{count}</Badge>
            </ToolbarItem>
          )}
          <ToolbarItem align={{ default: "alignEnd" }}>
            <Button
              variant={"plain"}
              size={"sm"}
              aria-label={"add"}
              icon={<AddCircleOIcon />}
              onClick={onAdd}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Card
        className={"pf-v6-u-y-md"}
        style={{ position: "relative" }}
        isPlain={false}
      >
        <a id={id} style={{ top: -200, position: "absolute" }} />
        {children}
      </Card>
    </>
  );
}
