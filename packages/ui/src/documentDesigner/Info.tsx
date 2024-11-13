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
  const { version, description } = useMachineSelector(({ context }) => {
    return {
      version: context.version,
      description: context.description,
    };
  });
  const actorRef = useMachineActorRef();
  return (
    <DescriptionList isHorizontal={true}>
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
  );
}
