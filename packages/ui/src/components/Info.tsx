import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { InlineEdit } from "./InlineEdit.tsx";
import { Markdown } from "./Markdown.tsx";

export function Info() {
  const { version, description } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => ({
      version: context.document.version,
      description: context.document.description,
    })
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
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
