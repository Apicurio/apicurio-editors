import {
  DataList,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Dropdown,
  DropdownItem,
  DropdownList,
  Label,
  MenuToggle,
} from "@patternfly/react-core";
import { EllipsisVIcon, TagIcon } from "@patternfly/react-icons";
import { useState } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Markdown } from "./Markdown.tsx";

export function TagDefinitions() {
  const { tags } = OpenApiEditorMachineContext.useSelector(({ context }) => ({
    tags: context.document.tags,
  }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <DataList aria-label="Tag definitions" isCompact>
      {tags.map((t, idx) => {
        const id = `tag-${idx}`;
        return (
          <Tag key={idx} id={id} name={t.name} description={t.description} />
        );
      })}
    </DataList>
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
                aria-label="Data list with actions example kebab toggle"
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
