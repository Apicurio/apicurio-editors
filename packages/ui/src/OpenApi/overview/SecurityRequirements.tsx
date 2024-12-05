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
import {
  useOpenApiEditorMachineOverviewRef,
  useOpenApiEditorMachineOverviewSelector,
} from "../../useOpenApiEditorMachine.ts";
import { SearchableTable } from "../../components/SearchableTable.tsx";
import { useEditableSection } from "./useEditableSection.ts";

export function SecurityRequirements() {
  const { securityRequirements } = useOpenApiEditorMachineOverviewSelector(
    ({ context }) => {
      return {
        securityRequirements: context.securityRequirements,
      };
    },
  );
  const actorRef = useOpenApiEditorMachineOverviewRef();
  const isEditable = useEditableSection();
  return (
    <SearchableTable
      data={securityRequirements}
      label={"security requirement"}
      editing={isEditable}
      onAdd={() => {}}
      onFilter={(sr, filter) =>
        sr.schemes.reduce(
          (_, scheme) => scheme.toLowerCase().includes(filter.toLowerCase()),
          false,
        )
      }
      onRenderRow={(s, idx) => (
        <SecurityRequirement
          id={`security-requirement-${idx}`}
          schemes={s.schemes}
        />
      )}
      onRemoveAll={() => {}}
    />
  );
}

function SecurityRequirement({
  id,
  schemes,
}: {
  id: string;
  schemes: string[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);
  return (
    <DataListItem aria-labelledby={id}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="scheme" width={2}>
              <span id={id}>{schemes.join(", ")}</span>
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
              <DropdownItem key="Change">Change</DropdownItem>
              <DropdownItem key="Delete">Delete</DropdownItem>
            </DropdownList>
          </Dropdown>
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  );
}
