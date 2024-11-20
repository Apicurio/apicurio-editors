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

export function Info() {
  const { title, version, description, editable } = useMachineSelector(
    ({ context }) => {
      return {
        title: context.title,
        version: context.version,
        description: context.description,
        editable: context.editable,
      };
    }
  );
  const actorRef = useMachineActorRef();
  return (
    <DescriptionList isHorizontal={true}>
      <DescriptionListGroup>
        <DescriptionListTerm>Title</DescriptionListTerm>
        <DescriptionListDescription>
          <InlineEdit
            onChange={(title) => {
              actorRef.send({ type: "CHANGE_TITLE", title });
            }}
            value={title}
            editing={editable}
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
            editing={editable}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Description</DescriptionListTerm>
        <DescriptionListDescription>
          <Markdown editing={editable}>{description}</Markdown>
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
}
