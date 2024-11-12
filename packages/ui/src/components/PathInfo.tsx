import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { InlineEdit } from "./InlineEdit.tsx";

export function PathInfo() {
  const { summary, description } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => {
      if (context.node.type !== "path") throw new Error("Invalid node type");
      return {
        summary: context.node.node.summary,
        description: context.node.node.description,
      };
    }
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <DescriptionList isHorizontal={true}>
      <DescriptionListGroup>
        <DescriptionListTerm>Version</DescriptionListTerm>
        <DescriptionListDescription>
          <InlineEdit
            onChange={(summary) => {
              actorRef.send({ type: "CHANGE_PATH_SUMMARY", summary });
            }}
            value={summary}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Description</DescriptionListTerm>
        <DescriptionListDescription>
          <InlineEdit
            onChange={(summary) => {
              actorRef.send({ type: "CHANGE_PATH_DESCRIPTION", summary });
            }}
            value={description}
          />
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
}
