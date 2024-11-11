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
  Label,
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
  TagIcon,
  TrashIcon,
} from "@patternfly/react-icons";
import { useState } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Markdown } from "./Markdown.tsx";

export function DocumentTagDefinitions() {
  const { tags } = OpenApiEditorMachineContext.useSelector(({ context }) => {
    if (context.node.type !== "root") throw new Error("Invalid node type");
    return {
      tags: context.node.node.tags,
    };
  });
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const [filter, setFilter] = useState("");
  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(filter.toLowerCase()) ||
      tag.description.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <Panel>
      {tags.length > 10 && (
        <PanelHeader>
          <Toolbar>
            <ToolbarContent>
              <ToolbarItem>
                <SearchInput
                  aria-label="Search for any tag..."
                  placeholder="Search for any tag..."
                  value={filter}
                  onChange={(_, v) => setFilter(v)}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button variant="primary" icon={<AddCircleOIcon />}>
                  Add a tag
                </Button>
              </ToolbarItem>
              <ToolbarItem variant="separator" />
              <ToolbarItem>
                <Button variant="link" icon={<TrashIcon />}>
                  Remove all tags
                </Button>
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
        </PanelHeader>
      )}
      <PanelMain>
        {filteredTags.length > 0 && (
          <DataList aria-label="Tag definitions" isCompact>
            {filteredTags.map((t, idx) => {
              const id = `tag-${idx}`;
              return (
                <Tag
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
            <EmptyState variant={"xs"}>
              <EmptyStateBody>
                No tags were found that meet the search criteria.
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

function Tag({
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
              <Label icon={<TagIcon />}>
                <span id={id}>{name}</span>
              </Label>
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
                aria-label="Tag actions"
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
