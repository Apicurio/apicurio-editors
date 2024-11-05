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

import { NavigationPath } from "../OpenApiEditorModels.ts";

export function Paths({
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
        <SimpleList
          className={"pf-v6-u-font-size-sm"}
          style={{ wordBreak: "break-word" }}
          isControlled={false}
        >
          {paths.map((p) => (
            <SimpleListItem
              key={p.name}
              onClick={() => onClick(p)}
              isActive={isActive(p)}
            >
              <Split hasGutter={true}>
                <SplitItem isFilled={true} i>
                  {p.name}
                </SplitItem>
                {p.validations.length > 0 && (
                  <SplitItem>
                    <Button variant={"plain"} icon={<InfoIcon />} />
                  </SplitItem>
                )}
              </Split>
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
