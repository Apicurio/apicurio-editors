import {
  Accordion,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor";
import { AccordionSection } from "./AccordionSection.tsx";
import { InlineEdit } from "./InlineEdit";
import { Markdown } from "./Markdown.tsx";

export function DocumentInfo() {
  const { version, description, contactName, contactEmail, contactUrl } =
    OpenApiEditorMachineContext.useSelector(({ context }) => ({
      version: context.document.version,
      description: context.document.description,
      contactName: context.document.contactName,
      contactEmail: context.document.contactEmail,
      contactUrl: context.document.contactUrl,
    }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <Accordion asDefinitionList={false}>
      <AccordionSection title={"Info"} id={"info"}>
        <DescriptionList isCompact={true}>
          <DescriptionListGroup>
            <DescriptionListTerm>Version</DescriptionListTerm>
            <DescriptionListDescription>
              <InlineEdit
                onChange={(version) => {
                  actorRef.send({ type: "CHANGE_VERSION", version });
                }}
                value={version}
              />
            </DescriptionListDescription>
          </DescriptionListGroup>
          <DescriptionListGroup>
            <DescriptionListTerm>Description</DescriptionListTerm>
            <DescriptionListDescription>
              <Markdown>{description}</Markdown>
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </AccordionSection>
      <AccordionSection title={"Contact"} id={"contact"}>
        <DescriptionList isCompact={true}>
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
      </AccordionSection>
    </Accordion>
  );
}
