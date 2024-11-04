import {
  Button,
  EmptyState,
  EmptyStateActions,
  SimpleList,
  SimpleListItem,
} from "@patternfly/react-core";
import { CodeIcon } from "@patternfly/react-icons";
import { NavigationDataType } from "../OpenApiEditorMachine.tsx";

export function DataTypes({
  dataTypes,
  filtered,
}: {
  dataTypes: NavigationDataType[];
  filtered: boolean;
}) {
  return (
    <>
      {dataTypes.length > 0 && (
        <SimpleList
          className={"pf-v6-u-font-size-sm"}
          style={{ wordBreak: "break-word" }}
        >
          {dataTypes.map((p) => (
            <SimpleListItem key={p.name}>
              <CodeIcon />
              &nbsp;{p.name}
            </SimpleListItem>
          ))}
        </SimpleList>
      )}
      {dataTypes.length === 0 && !filtered ? (
        <EmptyState variant={"xs"}>
          No reusable types have been created.{" "}
          <EmptyStateActions>
            <Button variant={"link"}>Add a data type</Button>
          </EmptyStateActions>
        </EmptyState>
      ) : (
        filtered && <EmptyState variant={"xs"}>No results found</EmptyState>
      )}
    </>
  );
}
