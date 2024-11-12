import {
  Button,
  DataList,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  Panel,
  PanelHeader,
  PanelMain,
  PanelMainBody,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { AddCircleOIcon, SearchIcon, TrashIcon } from "@patternfly/react-icons";
import { useState } from "react";
import { ServerRow } from "./ServerRow.tsx";
import { Server } from "../OpenApiEditorModels.ts";

export function ServersTable({
  servers,
  onAdd,
  onRemove,
  onRename,
  onRemoveAll,
}: {
  servers: Server[];
  onAdd: () => void;
  onRename: (id: string) => void;
  onRemove: (id: string) => void;
  onRemoveAll: () => void;
}) {
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
                <Button
                  variant="primary"
                  icon={<AddCircleOIcon />}
                  onClick={onAdd}
                >
                  Add a server
                </Button>
              </ToolbarItem>
              <ToolbarItem variant="separator" />
              <ToolbarItem>
                <Button
                  variant="link"
                  icon={<TrashIcon />}
                  onClick={onRemoveAll}
                >
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
                <ServerRow
                  key={idx}
                  id={id}
                  url={t.url}
                  description={t.description}
                  onRename={() => onRename(id)}
                  onRemove={() => onRemove(id)}
                />
              );
            })}
          </DataList>
        )}
        {filteredTags.length === 0 && filter.length > 0 && (
          <PanelMainBody>
            <EmptyState variant={"xs"} icon={SearchIcon}>
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
        {filteredTags.length === 0 && filter.length === 0 && (
          <PanelMainBody>
            <EmptyState variant={"xs"} icon={AddCircleOIcon}>
              <EmptyStateBody>No servers have been defined.</EmptyStateBody>
              <EmptyStateActions>
                <Button variant={"link"} onClick={onAdd}>
                  Add a server
                </Button>
              </EmptyStateActions>
            </EmptyState>
          </PanelMainBody>
        )}
      </PanelMain>
    </Panel>
  );
}
