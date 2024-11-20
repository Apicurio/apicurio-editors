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
import { useMachineSelector } from "./DocumentDesignerMachineContext.ts";
import { SearchableTable } from "../components/SearchableTable.tsx";
import { InlineEdit } from "../components/InlineEdit.tsx";

export function SecurityScheme() {
  const { securityScheme, editable } = useMachineSelector(({ context }) => {
    return {
      securityScheme: context.securityScheme,
      editable: context.editable,
    };
  });
  return (
    <SearchableTable
      data={securityScheme}
      label={"security scheme"}
      editing={editable}
      onAdd={() => {}}
      onFilter={(securityScheme, filter) =>
        securityScheme.name.toLowerCase().includes(filter.toLowerCase()) ||
        securityScheme.description.toLowerCase().includes(filter.toLowerCase())
      }
      onRenderRow={(s, idx) => (
        <SecuritySchemeRow
          id={`security-scheme-${idx}`}
          name={s.name}
          description={s.description}
          editable={editable}
        />
      )}
      onRemoveAll={() => {}}
    />
  );
}

function SecuritySchemeRow({
  id,
  name,
  description,
  editable,
}: {
  id: string;
  name: string;
  description: string;
  editable: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  return (
    <DataListItem aria-labelledby={id}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="name" width={2}>
              <span id={id}>
                <InlineEdit label={"Name"} value={name} />
              </span>
            </DataListCell>,
            <DataListCell key="description" width={5}>
              <Markdown label={"Description"}>{description}</Markdown>
            </DataListCell>,
          ]}
        />
        {editable && (
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
        )}
      </DataListItemRow>
    </DataListItem>
  );
}
