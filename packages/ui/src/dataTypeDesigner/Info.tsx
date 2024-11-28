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
} from "./DataTypeDesignerMachineContext.ts";
import { useEditableSection } from "./useEditableSection.ts";

export function Info() {
  const { description } = useMachineSelector(({ context }) => {
    return {
      description: context.description,
    };
  });
  const actorRef = useMachineActorRef();
  const isEditable = useEditableSection();
  return (
    <DescriptionList>
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
