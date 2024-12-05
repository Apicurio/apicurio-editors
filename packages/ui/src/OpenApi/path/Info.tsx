import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { InlineEdit } from "../../components/InlineEdit.tsx";
import { useEditableSection } from "../../components/useEditableSection.ts";
import {
  useOpenApiEditorMachinePathRef,
  useOpenApiEditorMachinePathSelector,
} from "../../useOpenApiEditorMachine.ts";

export function Info() {
  const { summary, description } = useOpenApiEditorMachinePathSelector(
    ({ context }) => {
      return {
        summary: context.summary,
        description: context.description,
      };
    },
  );
  const actorRef = useOpenApiEditorMachinePathRef();
  const isEditable = useEditableSection();
  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>Summary</DescriptionListTerm>
        <DescriptionListDescription>
          <InlineEdit
            onChange={(summary) => {
              actorRef.send({ type: "CHANGE_SUMMARY", summary });
            }}
            value={summary}
            editing={isEditable}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Description</DescriptionListTerm>
        <DescriptionListDescription>
          <InlineEdit
            onChange={(description) => {
              actorRef.send({ type: "CHANGE_DESCRIPTION", description });
            }}
            value={description}
            editing={isEditable}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
}
