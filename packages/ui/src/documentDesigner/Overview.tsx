import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { InlineEdit } from "../components/InlineEdit.tsx";
import { Markdown } from "../components/Markdown.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./DocumentDesignerMachineContext.ts";
import { useEditableSection } from "./useEditableSection.ts";

export function Overview() {
  const { title, version, description } = useMachineSelector(({ context }) => {
    return {
      title: context.title,
      version: context.version,
      description: context.description,
    };
  });
  const isEditable = useEditableSection();
  const actorRef = useMachineActorRef();
  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>Title</DescriptionListTerm>
        <DescriptionListDescription>
          <InlineEdit
            onChange={(title) => {
              actorRef.send({ type: "CHANGE_TITLE", title });
            }}
            value={title}
            editing={isEditable}
            autoFocus={true}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Version</DescriptionListTerm>
        <DescriptionListDescription>
          <InlineEdit
            onChange={(version) => {
              actorRef.send({ type: "CHANGE_VERSION", version });
            }}
            value={version}
            editing={isEditable}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Description</DescriptionListTerm>
        <DescriptionListDescription>
          <Markdown editing={isEditable}>{description}</Markdown>
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
}
