import {
  Button,
  EmptyState,
  EmptyStateActions,
  SimpleList,
  SimpleListItem,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { InfoIcon } from "@patternfly/react-icons";

import { NavigationResponse } from "../OpenApiEditorModels.ts";

export function Responses({
  responses,
  filtered,
  onClick,
  isActive,
}: {
  responses: NavigationResponse[];
  filtered: boolean;
  isActive: (path: NavigationResponse) => boolean;
  onClick: (path: NavigationResponse) => void;
}) {
  return (
    <>
      {responses.length > 0 && (
        <SimpleList
          className={"pf-v6-u-font-size-sm"}
          style={{ wordBreak: "break-word" }}
          isControlled={false}
        >
          {responses.map((r) => (
            <SimpleListItem
              key={r.name}
              onClick={() => onClick(r)}
              isActive={isActive(r)}
            >
              <Split hasGutter={true}>
                <SplitItem isFilled={true}>{r.name}</SplitItem>
                {r.validations.length > 0 && (
                  <SplitItem>
                    <Button variant={"plain"} icon={<InfoIcon />} />
                  </SplitItem>
                )}
              </Split>
            </SimpleListItem>
          ))}
        </SimpleList>
      )}
      {responses.length === 0 && !filtered ? (
        <EmptyState variant={"xs"}>
          No reusable responses have been created.{" "}
          <EmptyStateActions>
            <Button variant={"link"}>Add a response</Button>
          </EmptyStateActions>
        </EmptyState>
      ) : (
        responses.length === 0 &&
        filtered && <EmptyState variant={"xs"}>No results found</EmptyState>
      )}
    </>
  );
}
