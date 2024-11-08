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
  TrashIcon,
} from "@patternfly/react-icons";
import { useState } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Markdown } from "./Markdown.tsx";

export function Servers() {
  const { servers } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => ({
      servers: context.document.servers,
    })
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const [filter, setFilter] = useState("");
  const filteredTags = servers.filter(
    (server) =>
      server.url.toLowerCase().includes(filter.toLowerCase()) ||
      server.description.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <Panel>
      {servers.length > 10 && (
        <PanelHeader>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <SearchInput
                  aria-label="Search for any server..."
                  placeholder="Search for any server..."
                  value={filter}
                  onChange={(_, v) => setFilter(v)}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="primary" icon={<AddCircleOIcon />}>
                  Add a server
                </Button>
              </ToolbarItem>
              <ToolbarItem variant="separator" />
              <ToolbarItem>
                <Button variant="link" icon={<TrashIcon />}>
                  Remove all serverss
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
        </PanelHeader>
      )}
      <PanelMain>
        {filteredTags.length > 0 && (
          <DataList aria-label="Servers" isCompact>
            {filteredTags.map((t, idx) => {
              const id = `server-${idx}`;
              return (
                <Server
                  key={idx}
                  id={id}
                  url={t.url}
                  description={t.description}
                />
              );
            })}
          </DataList>
        )}
        {filteredTags.length === 0 && filter.length > 0 && (
          <PanelMainBody>
            <EmptyState variant={"xs"}>
              <EmptyStateBody>
                No servers were found that meet the search criteria.
              </EmptyStateBody>
              <EmptyStateActions>
                <Button variant={"link"} onClick={() => setFilter("")}>
                  Reset search
                </Button>
              </EmptyStateActions>
            </EmptyState>
          </PanelMainBody>
        )}
      </PanelMain>
    </Panel>
  );
}

function Server({
  id,
  url,
  description,
}: {
  id: string;
  url: string;
  description: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  return (
    <DataListItem aria-labelledby={id}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="url" width={2}>
              <span id={id}>{url}</span>
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
                aria-label="Server actions"
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
