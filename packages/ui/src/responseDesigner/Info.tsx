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
} from "./ResponseDesignerMachineContext.ts";

export function Info() {
  const { description, editable } = useMachineSelector(({ context }) => {
    return {
      description: context.description,
      editable: context.editable,
    };
  });
  const actorRef = useMachineActorRef();
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
            editing={editable}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
}
