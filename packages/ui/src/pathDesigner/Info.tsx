import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { InlineEdit } from "../components/InlineEdit.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./PathDesignerMachineContext.ts";
import { useEditableSection } from "./useEditableSection.ts";

export function Info() {
  const { summary, description } = useMachineSelector(({ context }) => {
    return {
      summary: context.summary,
      description: context.description,
    };
  });
  const actorRef = useMachineActorRef();
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
