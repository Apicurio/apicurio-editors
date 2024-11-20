import {
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { useState } from "react";
import { Markdown } from "../components/Markdown.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./DocumentDesignerMachineContext.ts";
import { SearchableTable } from "../components/SearchableTable.tsx";
import { InlineEdit } from "../components/InlineEdit.tsx";

export function TagDefinitions() {
  const { tags, editable } = useMachineSelector(({ context }) => {
    return {
      tags: context.tags,
      editable: context.editable,
    };
  });
  const actorRef = useMachineActorRef();
  return (
    <SearchableTable
      data={tags}
      label={"tag"}
      editing={editable}
      onAdd={() => {}}
      onFilter={(tag, filter) =>
        tag.name.toLowerCase().includes(filter.toLowerCase()) ||
        tag.description.toLowerCase().includes(filter.toLowerCase())
      }
      onRenderRow={(tag, idx) => (
        <Tag
          id={`tag-${idx}`}
          name={tag.name}
          description={tag.description}
          editing={editable}
        />
      )}
      onRemoveAll={() => {}}
    />
  );
}

function Tag({
  id,
  name,
  description,
  editing,
}: {
  id: string;
  name: string;
  description: string;
  editing: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  return (
    <DataListItem aria-labelledby={id}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="name" width={2}>
              <span id={id} className={"pf-v6-u-font-weight-bold"}>
                <InlineEdit value={name} editing={editing} />
              </span>
            </DataListCell>,
            <DataListCell key="description" width={5}>
              <Markdown editing={editing}>{description}</Markdown>
            </DataListCell>,
          ]}
        />
        {editing && (
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
        )}
      </DataListItemRow>
    </DataListItem>
  );
}
