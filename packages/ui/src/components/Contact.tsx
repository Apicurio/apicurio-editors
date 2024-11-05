import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { InlineEdit } from "./InlineEdit.tsx";

export function Contact() {
  const { contactName, contactEmail, contactUrl } =
    OpenApiEditorMachineContext.useSelector(({ context }) => ({
      contactName: context.document.contactName,
      contactEmail: context.document.contactEmail,
      contactUrl: context.document.contactUrl,
    }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();
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
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
}
