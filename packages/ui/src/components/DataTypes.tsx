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

import { NavigationDataType } from "../OpenApiEditorModels.ts";

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
              <Split hasGutter={true}>
                <SplitItem isFilled={true}>{p.name}</SplitItem>
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
