import {
  Button,
  EmptyState,
  EmptyStateActions,
  SimpleList,
  SimpleListItem,
  Split,
  SplitItem,
} from "@patternfly/react-core";

import { NavigationResponse } from "../OpenApiEditorModels.ts";

export function NavigationResponses({
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
        <SimpleList style={{ wordBreak: "break-word" }} isControlled={false}>
          {responses.map((r) => (
            <SimpleListItem
              key={r.name}
              onClick={() => onClick(r)}
              isActive={isActive(r)}
            >
              <Split hasGutter={true}>
                <SplitItem isFilled={true}>{r.name}</SplitItem>
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
