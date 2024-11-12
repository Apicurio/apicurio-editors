import {
  Button,
  EmptyState,
  EmptyStateActions,
  SimpleList,
  SimpleListItem,
  Split,
  SplitItem,
} from "@patternfly/react-core";

import { NavigationDataType } from "../OpenApiEditorModels.ts";

export function NavigationDataTypes({
  dataTypes,
  filtered,
  onClick,
  isActive,
}: {
  dataTypes: NavigationDataType[];
  filtered: boolean;
  isActive: (path: NavigationDataType) => boolean;
  onClick: (path: NavigationDataType) => void;
}) {
  return (
    <>
      {dataTypes.length > 0 && (
        <SimpleList
          className={"pf-v6-u-font-size-sm"}
          style={{ wordBreak: "break-word" }}
          isControlled={false}
        >
          {dataTypes.map((dt) => (
            <SimpleListItem
              key={dt.name}
              onClick={() => onClick(dt)}
              isActive={isActive(dt)}
            >
              <Split hasGutter={true}>
                <SplitItem isFilled={true}>{dt.name}</SplitItem>
              </Split>
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
        dataTypes.length === 0 &&
        filtered && <EmptyState variant={"xs"}>No results found</EmptyState>
      )}
    </>
  );
}
