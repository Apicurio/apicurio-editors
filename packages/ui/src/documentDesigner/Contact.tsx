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
} from "./DocumentDesignerMachineContext.ts";

export function Contact() {
  const { contactName, contactEmail, contactUrl, editable } =
    useMachineSelector(({ context }) => ({
      contactName: context.contactName,
      contactEmail: context.contactEmail,
      contactUrl: context.contactUrl,
      editable: context.editable,
    }));
  const actorRef = useMachineActorRef();
  return (
    <DescriptionList isCompact={true} isHorizontal={true}>
      <DescriptionListGroup>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDescription>
          <InlineEdit
            onChange={(contactName) => {
              actorRef.send({ type: "CHANGE_CONTACT_NAME", contactName });
            }}
            value={contactName}
            editing={editable}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Email</DescriptionListTerm>
        <DescriptionListDescription>
          <InlineEdit
            onChange={(contactEmail) => {
              actorRef.send({ type: "CHANGE_CONTACT_EMAIL", contactEmail });
            }}
            value={contactEmail}
            editing={editable}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Url</DescriptionListTerm>
        <DescriptionListDescription>
          <InlineEdit
            onChange={(contactUrl) => {
              actorRef.send({ type: "CHANGE_CONTACT_URL", contactUrl });
            }}
            value={contactUrl}
            editing={editable}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
}
