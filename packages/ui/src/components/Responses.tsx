import {
  Button,
  EmptyState,
  EmptyStateActions,
  SimpleList,
  SimpleListItem,
} from "@patternfly/react-core";
import { ReplyAllIcon } from "@patternfly/react-icons";
import { NavigationResponse } from "../OpenApiEditorMachine.tsx";

export function Responses({
  responses,
  filtered,
}: {
  responses: NavigationResponse[];
  filtered: boolean;
}) {
  return (
    <>
      {responses.length > 0 && (
        <SimpleList
          className={"pf-v6-u-font-size-sm"}
          style={{ wordBreak: "break-word" }}
        >
          {responses.map((p) => (
            <SimpleListItem key={p.name}>
              <ReplyAllIcon />
              &nbsp;{p.name}
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
        filtered && <EmptyState variant={"xs"}>No results found</EmptyState>
      )}
    </>
  );
}
