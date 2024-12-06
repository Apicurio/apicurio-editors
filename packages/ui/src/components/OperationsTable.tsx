import { DataList } from "@patternfly/react-core";
import { OperationRow } from "./OperationRow.tsx";
import { Operations, Path } from "../OpenApiEditorModels.ts";

export function OperationsTable({
  path,
  searchTerm,
  forceExpand,
}: {
  path: Path;
  searchTerm?: string;
  forceExpand?: boolean;
}) {
  return (
    <DataList aria-label={"Path operations"}>
      {Operations.map((opName) => {
        const o = path.operations[opName];
        if (o !== undefined) {
          return (
            <OperationRow
              key={`path-${path.node.nodePath}-${opName}`}
              operation={o}
              pathId={path.node.nodePath}
              name={opName}
              searchTerm={searchTerm}
              forceExpand={forceExpand}
            />
          );
        }
      })}
    </DataList>
  );
}
