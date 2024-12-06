import { useEditableSection } from "../../components/useEditableSection.ts";
import {
  useOpenApiEditorMachinePathRef,
  useOpenApiEditorMachinePathSelector,
} from "../../useOpenApiEditorMachine.ts";
import { Markdown } from "../../components/Markdown.tsx";
import { Stack } from "@patternfly/react-core";

export function Info() {
  const { summary, description } = useOpenApiEditorMachinePathSelector(
    ({ context }) => {
      return {
        summary: context.summary,
        description: context.description,
      };
    },
  );
  const actorRef = useOpenApiEditorMachinePathRef();
  const isEditable = useEditableSection();
  return (
    <Stack hasGutter={true}>
      <Markdown
        onChange={(summary) => {
          actorRef.send({ type: "CHANGE_SUMMARY", summary });
        }}
        editing={isEditable}
        label={"Summary"}
      >
        {summary}
      </Markdown>
      <Markdown
        onChange={(description) => {
          actorRef.send({ type: "CHANGE_DESCRIPTION", description });
        }}
        editing={isEditable}
        label={"Description"}
      >
        {description}
      </Markdown>
    </Stack>
  );
}
