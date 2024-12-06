import { Operation, Operations } from "../OpenApiEditorModels.ts";
import { useState } from "react";
import {
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  LabelGroup,
} from "@patternfly/react-core";
import { OperationLabel } from "./OperationLabel.tsx";
import { Markdown } from "./Markdown.tsx";
import { TagLabel } from "./TagLabel.tsx";
import { OperationDetails } from "./OperationDetails.tsx";

export function OperationRow({
  operation,
  pathId,
  name,
  searchTerm = "",
  forceExpand = false,
  expandable = false,
}: {
  operation: Operation;
  pathId: string;
  name: (typeof Operations)[number];
  searchTerm?: string;
  forceExpand?: boolean;
  expandable?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isExpanded = forceExpand || expanded;
  return (
    <DataListItem
      aria-labelledby={`path-${pathId}-operation-${name}`}
      isExpanded={isExpanded && expandable}
    >
      <DataListItemRow>
        {expandable && (
          <DataListToggle
            onClick={() => setExpanded((v) => !v)}
            isExpanded={isExpanded}
            id={`path-${pathId}-operation-${name}-toggle`}
            aria-controls={`path-${pathId}-operation-${name}-expand`}
          />
        )}
        <DataListItemCells
          dataListCells={[
            <DataListCell isFilled={false} key={"operation"}>
              <OperationLabel name={name} />
            </DataListCell>,
            <DataListCell key={"summary"}>
              <Markdown searchTerm={searchTerm}>{operation.summary}</Markdown>
            </DataListCell>,
            <DataListCell key={"tags"} isFilled={false}>
              <LabelGroup>
                {operation.tags.map((t) => (
                  <TagLabel key={t} name={t} />
                ))}
              </LabelGroup>
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
      <DataListContent
        aria-label={"Path info"}
        hasNoPadding={true}
        id={`path-${pathId}-operation-${name}-expand`}
      >
        {(isExpanded || !expandable) && (
          <OperationDetails
            operation={operation}
            searchTerm={searchTerm}
            forceExpand={forceExpand}
          />
        )}
      </DataListContent>
    </DataListItem>
  );
}
