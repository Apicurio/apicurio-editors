import {
  DataTypeProperty,
  Operation,
  Operations,
  Path,
} from "../OpenApiEditorModels.ts";
import {
  Accordion,
  Button,
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
  DataList,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  LabelGroup,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Title,
} from "@patternfly/react-core";
import { Markdown } from "../components/Markdown.tsx";
import { useState } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { PathBreadcrumb } from "../components/PathBreadcrumb.tsx";
import { OperationLabel } from "./OperationLabel.tsx";
import { TagLabel } from "../components/TagLabel.tsx";
import { AccordionSection } from "../components/AccordionSection.tsx";
import { StatusCodeLabel } from "../components/StatusCodeLabel.tsx";

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
          </CardBody>
        )}
      </CardExpandableContent>
    </Card>
  );
}

function OperationRow({
  operation,
  pathId,
  name,
  searchTerm,
  forceExpand,
}: {
  operation: Operation;
  pathId: string;
  name: (typeof Operations)[number];
  searchTerm?: string;
  forceExpand?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isExpanded = forceExpand || expanded;
  return (
    <DataListItem
      aria-labelledby={`path-${pathId}-operation-${name}`}
      isExpanded={isExpanded}
    >
      <DataListItemRow>
        <DataListToggle
          onClick={() => setExpanded((v) => !v)}
          isExpanded={isExpanded}
          id={`path-${pathId}-operation-${name}-toggle`}
          aria-controls={`path-${pathId}-operation-${name}-expand`}
        />
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
        {isExpanded && (
          <Stack hasGutter={true}>
            {operation.description && (
              <Markdown searchTerm={searchTerm}>
                {operation.description}
              </Markdown>
            )}
            {operation.pathParameters.length +
              operation.headerParameters.length +
              operation.queryParameters.length +
              operation.headerParameters.length >
              0 && (
              <>
                <Title headingLevel={"h4"}>Request</Title>
                <Accordion>
                  {operation.pathParameters.length > 0 && (
                    <AccordionSection
                      title={"Path parameters"}
                      id={"path-params"}
                      startExpanded={forceExpand}
                      count={operation.pathParameters.length}
                    >
                      <Parameters
                        parameters={operation.pathParameters}
                        searchTerm={searchTerm}
                      />
                    </AccordionSection>
                  )}
                  {operation.queryParameters.length > 0 && (
                    <AccordionSection
                      title={"Query parameters"}
                      id={"query-params"}
                      startExpanded={forceExpand}
                      count={operation.queryParameters.length}
                    >
                      <Parameters
                        parameters={operation.queryParameters}
                        searchTerm={searchTerm}
                      />
                    </AccordionSection>
                  )}
                  {operation.headerParameters.length > 0 && (
                    <AccordionSection
                      title={"Header parameters"}
                      id={"header-params"}
                      startExpanded={forceExpand}
                      count={operation.headerParameters.length}
                    >
                      <Parameters
                        parameters={operation.headerParameters}
                        searchTerm={searchTerm}
                      />
                    </AccordionSection>
                  )}
                  {operation.cookieParameters.length > 0 && (
                    <AccordionSection
                      title={"Cookie parameters"}
                      id={"cookie-params"}
                      startExpanded={forceExpand}
                      count={operation.cookieParameters.length}
                    >
                      <Parameters
                        parameters={operation.cookieParameters}
                        searchTerm={searchTerm}
                      />
                    </AccordionSection>
                  )}
                </Accordion>
              </>
            )}
            <Title headingLevel={"h4"}>Responses</Title>
            <Accordion>
              {operation.responses.map((t) => (
                <AccordionSection
                  title={
                    <Split hasGutter={true}>
                      <StatusCodeLabel code={t.statusCode} />
                      {t.description && (
                        <Markdown searchTerm={searchTerm}>
                          {t.description}
                        </Markdown>
                      )}
                    </Split>
                  }
                  id={`response-${t.statusCode}`}
                  startExpanded={false}
                >
                  TODO
                </AccordionSection>
              ))}
            </Accordion>
          </Stack>
        )}
      </DataListContent>
    </DataListItem>
  );
}

function Parameters({
  parameters,
  searchTerm,
}: {
  parameters: DataTypeProperty[];
  searchTerm?: string;
}) {
  return (
    <DescriptionList>
      {parameters.map((p, idx) => (
        <DescriptionListGroup key={idx}>
          <DescriptionListTerm>
            <Stack hasGutter={true}>
              {p.name}
              {p.required && (
                <StackItem>
                  <Label color={"blue"}>Required</Label>
                </StackItem>
              )}
            </Stack>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <Stack hasGutter={true}>
              {p.type}
              {p.description && (
                <StackItem>
                  <Markdown searchTerm={searchTerm}>{p.description}</Markdown>
                </StackItem>
              )}
            </Stack>
          </DescriptionListDescription>
        </DescriptionListGroup>
      ))}
    </DescriptionList>
  );
}
