import {
  Button,
  EmptyState,
  EmptyStateActions,
  SimpleList,
  SimpleListItem,
} from "@patternfly/react-core";
import { NavigationPath } from "../OpenApiEditorMachine.tsx";

export function Paths({
  paths,
  filtered,
}: {
  paths: NavigationPath[];
  filtered: boolean;
}) {
  return (
    <>
      {paths.length > 0 && (
        <SimpleList
          className={"pf-v6-u-font-size-sm"}
          style={{ wordBreak: "break-word" }}
        >
          {paths.map((p) => (
            <SimpleListItem key={p.name}>{p.name}</SimpleListItem>
          ))}
        </SimpleList>
      )}
      {paths.length === 0 && !filtered ? (
        <EmptyState variant={"xs"}>
          No paths have been created.{" "}
          <EmptyStateActions>
            <Button variant={"link"}>Add a path</Button>
          </EmptyStateActions>
        </EmptyState>
      ) : (
        filtered && <EmptyState variant={"xs"}>No results found</EmptyState>
      )}
    </>
  );
}
