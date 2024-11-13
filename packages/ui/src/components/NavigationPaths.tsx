import {
  Button,
  EmptyState,
  EmptyStateActions,
  SimpleList,
  SimpleListItem,
} from "@patternfly/react-core";

import { NavigationPath } from "../OpenApiEditorModels.ts";

export function NavigationPaths({
  paths,
  filtered,
  isActive,
  onClick,
}: {
  paths: NavigationPath[];
  filtered: boolean;
  isActive: (path: NavigationPath) => boolean;
  onClick: (path: NavigationPath) => void;
}) {
  return (
    <>
      {paths.length > 0 && (
        <SimpleList style={{ wordBreak: "break-word" }} isControlled={false}>
          {paths.map((p) => (
            <SimpleListItem
              key={p.path}
              onClick={() => onClick(p)}
              isActive={isActive(p)}
            >
              {p.path}
            </SimpleListItem>
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
        paths.length === 0 &&
        filtered && <EmptyState variant={"xs"}>No results found</EmptyState>
      )}
    </>
  );
}
