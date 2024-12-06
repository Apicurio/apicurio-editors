import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Flex,
  FlexItem,
  Label,
  Stack,
  StackItem,
  Title,
} from "@patternfly/react-core";
import { InlineEdit } from "../../components/InlineEdit.tsx";
import { Markdown } from "../../components/Markdown.tsx";
import {
  useOpenApiEditorMachineOverviewRef,
  useOpenApiEditorMachineOverviewSelector,
} from "../../useOpenApiEditorMachine.ts";
import { useEditableSection } from "./useEditableSection.ts";

export function Information() {
  const { title, version, description } =
    useOpenApiEditorMachineOverviewSelector(({ context }) => {
      return {
        title: context.title,
        version: context.version,
        description: context.description,
      };
    });
  const isEditable = useEditableSection();
  const actorRef = useOpenApiEditorMachineOverviewRef();
  return isEditable ? (
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
  ) : (
    <Stack hasGutter={true}>
      <StackItem>
        <Flex>
          <Title headingLevel={"h1"}>
            <InlineEdit
              onChange={(title) => {
                actorRef.send({ type: "CHANGE_TITLE", title });
              }}
              value={title}
              editing={isEditable}
              autoFocus={true}
            />
          </Title>
          <FlexItem alignSelf={{ default: "alignSelfCenter" }}>
            <Label variant={"outline"}>{version}</Label>
          </FlexItem>
        </Flex>
      </StackItem>
      <Markdown editing={isEditable} label={"Description"}>
        {description}
      </Markdown>
    </Stack>
  );
}
