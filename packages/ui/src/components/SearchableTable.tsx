import {
  Button,
  Card,
  CardBody,
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
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { AddCircleOIcon, SearchIcon, TrashIcon } from "@patternfly/react-icons";
import { Fragment, ReactNode, useState } from "react";

export function SearchableTable<T>({
  data,
  label,
  editing,
  onFilter,
  onRenderRow,
  onAdd,
  onRemoveAll,
}: {
  data: T[];
  label: string;
  editing: boolean;
  onAdd: () => void;
  onFilter: (data: T, filter: string) => boolean;
  onRenderRow: (data: T, idx: number) => ReactNode;
  onRemoveAll: () => void;
}) {
  const [filter, setFilter] = useState("");
  const filteredData = data.filter((v) => onFilter(v, filter));
  return (
    <Panel>
      {data.length > 10 && (
        <PanelHeader>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <SearchInput
                  aria-label={`Search for any ${label}...`}
                  placeholder={`Search for any ${label}...`}
                  value={filter}
                  onChange={(_, v) => setFilter(v)}
                />
              </ToolbarItem>
              {editing && (
                <ToolbarGroup>
                  <ToolbarItem>
                    <Button
                      variant="primary"
                      icon={<AddCircleOIcon />}
                      onClick={onAdd}
                    >
                      Add a {label}
                    </Button>
                  </ToolbarItem>
                  <ToolbarItem variant="separator" />
                  <ToolbarItem>
                    <Button
                      variant="link"
                      icon={<TrashIcon />}
                      onClick={onRemoveAll}
                    >
                      Remove all
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              )}
            </ToolbarContent>
          </Toolbar>
        </PanelHeader>
      )}
      <PanelMain>
        <Card>
          <CardBody>
            {filteredData.length > 0 && (
              <DataList
                aria-label="Servers"
                gridBreakpoint={editing ? "always" : undefined}
              >
                {filteredData.map((t, idx) => {
                  return <Fragment key={idx}>{onRenderRow(t, idx)}</Fragment>;
                })}
              </DataList>
            )}
            {filteredData.length === 0 && filter.length > 0 && (
              <PanelMainBody>
                <EmptyState variant={"xs"} icon={SearchIcon}>
                  <EmptyStateBody>
                    No {label}s were found that meet the search criteria.
                  </EmptyStateBody>
                  <EmptyStateActions>
                    <Button variant={"link"} onClick={() => setFilter("")}>
                      Reset search
                    </Button>
                  </EmptyStateActions>
                </EmptyState>
              </PanelMainBody>
            )}
            {filteredData.length === 0 && filter.length === 0 && (
              <PanelMainBody>
                <EmptyState
                  variant={"xs"}
                  icon={editing ? AddCircleOIcon : undefined}
                >
                  <EmptyStateBody>
                    No {label}s have been defined.
                  </EmptyStateBody>
                  {editing && (
                    <EmptyStateActions>
                      <Button variant={"link"} onClick={onAdd}>
                        Add a {label}
                      </Button>
                    </EmptyStateActions>
                  )}
                </EmptyState>
              </PanelMainBody>
            )}
          </CardBody>
        </Card>
      </PanelMain>
    </Panel>
  );
}
