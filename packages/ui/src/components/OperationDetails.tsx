import { Accordion, Split, Stack, Title } from "@patternfly/react-core";
import { Markdown } from "./Markdown.tsx";
import { OperationParameters } from "./OperationParameters.tsx";
import { AccordionSection } from "./AccordionSection.tsx";
import { StatusCodeLabel } from "./StatusCodeLabel.tsx";
import { Operation } from "../OpenApiEditorModels.ts";

export function OperationDetails({
  operation,
  forceExpand = false,
  searchTerm = "",
  editable = false,
}: {
  operation: Operation;
  forceExpand?: boolean;
  searchTerm?: string;
  editable?: boolean;
}) {
  return (
    <Stack hasGutter={true}>
      {operation.summary && (
        <Title headingLevel={"h3"}>
          <Markdown
            searchTerm={searchTerm}
            editing={editable}
            label={"Summary"}
          >
            {operation.summary}
          </Markdown>
        </Title>
      )}
      {operation.description && (
        <Markdown
          searchTerm={searchTerm}
          editing={editable}
          label={"Description"}
        >
          {operation.description}
        </Markdown>
      )}
      <OperationParameters
        operation={operation}
        forceExpand={forceExpand}
        searchTerm={searchTerm}
        editable={editable}
      />
      <Title headingLevel={"h4"}>Responses</Title>
      <Accordion togglePosition={"start"}>
        {operation.responses.map((t) => (
          <AccordionSection
            key={t.statusCode}
            title={
              <Split hasGutter={true}>
                <StatusCodeLabel code={t.statusCode} />
                {t.description ||
                  (editable && (
                    <Markdown
                      searchTerm={searchTerm}
                      editing={editable}
                      label={"Description"}
                    >
                      {t.description ?? ""}
                    </Markdown>
                  ))}
              </Split>
            }
            id={`response-${t.statusCode}`}
            startExpanded={forceExpand}
          >
            TODO
          </AccordionSection>
        ))}
      </Accordion>
    </Stack>
  );
}
