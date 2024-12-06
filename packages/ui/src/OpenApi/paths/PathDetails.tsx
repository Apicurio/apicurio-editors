import { Operations, Path } from "../../OpenApiEditorModels.ts";
import {
  Button,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  LabelGroup,
} from "@patternfly/react-core";
import { Markdown } from "../../components/Markdown.tsx";
import { useState } from "react";
import { OpenApiEditorMachineContext } from "../../OpenApiEditor.tsx";
import { PathBreadcrumb } from "../../components/PathBreadcrumb.tsx";
import { OperationsTable } from "../../components/OperationsTable.tsx";
import { createSafeAnchor } from "../../utils/createSafeAnchor.ts";
import { OperationLabel } from "../../components/OperationLabel.tsx";

export function PathDetails({
  path,
  searchTerm = "",
  forceExpand = false,
}: {
  path: Path;
  searchTerm?: string;
  forceExpand?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const isExpanded = forceExpand || expanded;
  const pathId = createSafeAnchor(path.node.path);
  return (
    <DataListItem aria-labelledby={`path-${pathId}`} isExpanded={isExpanded}>
      <DataListItemRow>
        <DataListToggle
          onClick={() => setExpanded((v) => !v)}
          isExpanded={isExpanded}
          id={`path-${pathId}-toggle`}
          aria-controls={`path-${pathId}-expand`}
        />

        <DataListItemCells
          dataListCells={[
            <DataListCell key={"path"} isFilled={false}>
              <Button
                variant={"link"}
                isInline={true}
                onClick={() =>
                  actorRef.send({
                    type: "SELECT_PATH_DESIGNER",
                    path: path.node.path,
                    nodePath: path.node.nodePath,
                  })
                }
              >
                <PathBreadcrumb path={path.node.path} />
              </Button>
            </DataListCell>,
            <DataListCell key={"operations"} isFilled={false}>
              <LabelGroup>
                {Operations.map((opName) => {
                  const o = path.operations[opName];
                  if (o !== undefined) {
                    return <OperationLabel name={opName} key={opName} />;
                  }
                })}
              </LabelGroup>
            </DataListCell>,
            <DataListCell key={"summary"}>
              <Markdown>{path.summary}</Markdown>
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
      <DataListContent
        aria-label={"Path info"}
        hasNoPadding={true}
        id={`path-${pathId}`}
        isHidden={!isExpanded}
      >
        {isExpanded && (
          <>
            {path.description && (
              <Markdown searchTerm={searchTerm}>{path.description}</Markdown>
            )}
            <OperationsTable
              path={path}
              searchTerm={searchTerm}
              forceExpand={forceExpand}
            />
          </>
        )}
      </DataListContent>
    </DataListItem>
  );
}
