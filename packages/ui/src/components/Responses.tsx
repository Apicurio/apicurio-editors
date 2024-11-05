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
