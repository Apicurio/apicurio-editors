import { useState } from "react";
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
import { Markdown } from "./Markdown.tsx";
import { EllipsisVIcon } from "@patternfly/react-icons";

export function ServerRow({
  id,
  url,
  description,
  onRename,
  onRemove,
}: {
  id: string;
  url: string;
  description: string;
  onRename: () => void;
  onRemove: () => void;
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
              <DropdownItem key="Rename" onClick={onRename}>
                Rename
              </DropdownItem>
              <DropdownItem key="Delete" onClick={onRemove}>
                Delete
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  );
}
