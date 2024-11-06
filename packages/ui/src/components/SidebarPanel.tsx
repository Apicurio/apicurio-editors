import { ReactNode } from "react";
import {
  Badge,
  Button,
  Divider,
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { AddCircleOIcon } from "@patternfly/react-icons";

export function SidebarPanel({
  title,
  count,
  onAdd,
  children,
}: {
  title: ReactNode;
  footer: ReactNode;
  count?: number;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <Panel isScrollable={true}>
      <PanelHeader>
        <Toolbar className={"pf-v6-u-p-0"}>
          <ToolbarContent>
            <ToolbarItem alignSelf={"center"}>
              <Title headingLevel={"h6"}>{title}</Title>
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
      </PanelHeader>
      <Divider />
      <PanelMain tabIndex={0}>
        <PanelMainBody className={"pf-v6-u-p-sm"}>{children}</PanelMainBody>
      </PanelMain>
    </Panel>
  );
}
