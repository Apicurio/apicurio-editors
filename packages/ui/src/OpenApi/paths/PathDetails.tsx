import { Operations, Path } from "../../OpenApiEditorModels.ts";
import {
  Button,
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
  LabelGroup,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { Markdown } from "../../components/Markdown.tsx";
import { useState } from "react";
import { OpenApiEditorMachineContext } from "../../OpenApiEditor.tsx";
import { PathBreadcrumb } from "../../components/PathBreadcrumb.tsx";
import { OperationLabel } from "../../components/OperationLabel.tsx";
import { OperationsTable } from "../../components/OperationsTable.tsx";

export function PathDetails({
  path,
  searchTerm,
  forceExpand,
}: {
  path: Path;
  searchTerm?: string;
  forceExpand?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const isExpanded = forceExpand || expanded;
  return (
    <Card isCompact={true} isPlain={true} isExpanded={isExpanded}>
      <CardHeader onExpand={() => setExpanded((v) => !v)}>
        <Split hasGutter={true}>
          <CardTitle id={`path-title-${path.node.nodePath}`}>
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
          </CardTitle>
          <SplitItem isFilled={true}>
            {path.summary && (
              <Markdown searchTerm={searchTerm}>{path.summary}</Markdown>
            )}
          </SplitItem>
          <LabelGroup>
            {Operations.map((opName) => {
              const o = path.operations[opName];
              if (o !== undefined) {
                return <OperationLabel name={opName} key={opName} />;
              }
            })}
          </LabelGroup>
        </Split>
      </CardHeader>
      <CardExpandableContent>
        {isExpanded && (
          <CardBody>
            {path.description && (
              <Markdown searchTerm={searchTerm}>{path.description}</Markdown>
            )}
            <OperationsTable
              path={path}
              searchTerm={searchTerm}
              forceExpand={forceExpand}
            />
          </CardBody>
        )}
      </CardExpandableContent>
    </Card>
  );
}
