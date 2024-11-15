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
  PanelMain,
  PanelMainBody,
} from "@patternfly/react-core";
import { AddCircleOIcon, EllipsisVIcon } from "@patternfly/react-icons";
import { useState } from "react";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./DocumentDesignerMachineContext.ts";

export function SecurityRequirements() {
  const { securityRequirements } = useMachineSelector(({ context }) => {
    return {
      securityRequirements: context.securityRequirements,
    };
  });
  const actorRef = useMachineActorRef();
  return (
    <Panel>
      <PanelMain>
        {securityRequirements.length > 0 && (
          <DataList aria-label="Security requirements" isCompact>
            {securityRequirements.map((sr, idx) => {
              const id = `server-${idx}`;
              return (
                <SecurityRequirement key={idx} id={id} schemes={sr.schemes} />
              );
            })}
          </DataList>
        )}
        {securityRequirements.length === 0 && (
          <PanelMainBody>
            <EmptyState variant={"xs"} icon={AddCircleOIcon}>
              <EmptyStateBody>
                No security requirements have been configured.{" "}
              </EmptyStateBody>
              <EmptyStateActions>
                <Button variant={"link"}>Add security requirement</Button>
              </EmptyStateActions>
            </EmptyState>
          </PanelMainBody>
        )}
      </PanelMain>
    </Panel>
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
