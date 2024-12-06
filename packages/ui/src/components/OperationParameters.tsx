import {
  Accordion,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  Stack,
  StackItem,
  Switch,
  Title,
} from "@patternfly/react-core";
import { AccordionSection } from "./AccordionSection.tsx";
import { DataTypeProperty, Operation } from "../OpenApiEditorModels.ts";
import { Markdown } from "./Markdown.tsx";
import { InlineEdit } from "./InlineEdit.tsx";

export function OperationParameters({
  operation,
  forceExpand,
  searchTerm,
  editable = false,
}: {
  operation: Operation;
  forceExpand?: boolean;
  searchTerm?: string;
  editable?: boolean;
}) {
  return (
    <>
      <Title headingLevel={"h4"}>Request</Title>
      {operation.pathParameters.length +
        operation.headerParameters.length +
        operation.queryParameters.length +
        operation.headerParameters.length >
      0 ? (
        <>
          <Accordion togglePosition={"start"}>
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
                  editable={editable}
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
                  editable={editable}
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
                  editable={editable}
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
                  editable={editable}
                />
              </AccordionSection>
            )}
          </Accordion>
        </>
      ) : (
        "No parameters"
      )}
    </>
  );
}

function Parameters({
  parameters,
  searchTerm,
  editable = false,
}: {
  parameters: DataTypeProperty[];
  searchTerm?: string;
  editable?: boolean;
}) {
  return (
    <DescriptionList>
      {parameters.map((p, idx) => (
        <DescriptionListGroup key={idx}>
          <DescriptionListTerm>
            <Stack hasGutter={true}>
              <InlineEdit value={p.name} editing={editable} />
              {p.required ||
                (editable && (
                  <StackItem>
                    {editable ? (
                      <Switch isChecked={p.required} label={"Required"} />
                    ) : (
                      <Label color={"blue"}>Required</Label>
                    )}
                  </StackItem>
                ))}
            </Stack>
          </DescriptionListTerm>
          <DescriptionListDescription>
            <Stack hasGutter={true}>
              {p.type}
              {p.description ||
                (editable && (
                  <StackItem>
                    <Markdown searchTerm={searchTerm} editing={editable}>
                      {p.description ?? ""}
                    </Markdown>
                  </StackItem>
                ))}
            </Stack>
          </DescriptionListDescription>
        </DescriptionListGroup>
      ))}
    </DescriptionList>
  );
}
