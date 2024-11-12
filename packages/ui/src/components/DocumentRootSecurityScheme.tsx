import {
  Button,
  DataList,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  MenuToggle,
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  AddCircleOIcon,
  EllipsisVIcon,
  SearchIcon,
  TrashIcon,
} from "@patternfly/react-icons";
import { useState } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Markdown } from "./Markdown.tsx";

export function DocumentRootSecurityScheme() {
  const { securityScheme } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => {
      if (context.node.type !== "root") throw new Error("Invalid node type");
      return {
        securityScheme: context.node.node.securityScheme,
      };
    }
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const [filter, setFilter] = useState("");
  const filteredTags = securityScheme.filter(
    (securityScheme) =>
      securityScheme.name.toLowerCase().includes(filter.toLowerCase()) ||
      securityScheme.description.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <Panel>
      {securityScheme.length > 10 && (
        <PanelHeader>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <SearchInput
                  aria-label="Search for any security scheme..."
                  placeholder="Search for any security scheme..."
                  value={filter}
                  onChange={(_, v) => setFilter(v)}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="primary" icon={<AddCircleOIcon />}>
                  Add a security scheme
                </Button>
              </ToolbarItem>
              <ToolbarItem variant="separator" />
              <ToolbarItem>
                <Button variant="link" icon={<TrashIcon />}>
                  Remove all security schemes
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
        </PanelHeader>
      )}
      <PanelMain>
        {filteredTags.length > 0 && (
          <DataList aria-label="Security scheme" isCompact>
            {filteredTags.map((t, idx) => {
              const id = `securityScheme-${idx}`;
              return (
                <SecuritySchemeRow
                  key={idx}
                  id={id}
                  name={t.name}
                  description={t.description}
                />
              );
            })}
          </DataList>
        )}
        {filteredTags.length === 0 && filter.length > 0 && (
          <PanelMainBody>
            <EmptyState variant={"xs"} icon={SearchIcon}>
              <EmptyStateBody>
                No security scheme were found that meet the search criteria.
              </EmptyStateBody>
              <EmptyStateActions>
                <Button variant={"link"} onClick={() => setFilter("")}>
                  Reset search
                </Button>
              </EmptyStateActions>
            </EmptyState>
          </PanelMainBody>
        )}
        {securityScheme.length === 0 && filter.length === 0 && (
          <PanelMainBody>
            <EmptyState variant={"xs"} icon={AddCircleOIcon}>
              <EmptyStateBody>
                No security scheme have been configured.
              </EmptyStateBody>
              <EmptyStateActions>
                <Button variant={"link"}>Add security scheme</Button>
              </EmptyStateActions>
            </EmptyState>
          </PanelMainBody>
        )}
      </PanelMain>
    </Panel>
  );
}

function SecuritySchemeRow({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  return (
    <DataListItem aria-labelledby={id}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="name" width={2}>
              <span id={id}>{name}</span>
            </DataListCell>,
            <DataListCell key="description" width={5}>
              <Markdown>{description}</Markdown>
            </DataListCell>,
          ]}
        />
        <DataListAction
          aria-labelledby={`${id}-actions`}
          id={`${id}-actions`}
          aria-label="Actions"
        >
          <Dropdown
            popperProps={{ position: "right" }}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                isExpanded={isMenuOpen}
                onClick={toggleMenu}
                variant="plain"
                aria-label="Security scheme actions"
              >
                <EllipsisVIcon aria-hidden="true" />
              </MenuToggle>
            )}
            isOpen={isMenuOpen}
            onOpenChange={(isOpen: boolean) => setIsMenuOpen(isOpen)}
          >
            <DropdownList>
              <DropdownItem key="Rename">Rename</DropdownItem>
              <DropdownItem key="Delete">Delete</DropdownItem>
            </DropdownList>
          </Dropdown>
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  );
}
