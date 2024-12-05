import {
  Button,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { Markdown } from "../../components/Markdown.tsx";
import {
  useOpenApiEditorMachineOverviewRef,
  useOpenApiEditorMachineOverviewSelector,
} from "../../useOpenApiEditorMachine.ts";
import { SearchableTable } from "../../components/SearchableTable.tsx";
import { InlineEdit } from "../../components/InlineEdit.tsx";
import { getTagId } from "../../components/TagLabel.tsx";
import { useEditableSection } from "./useEditableSection.ts";

export function TagDefinitions() {
  const { tags } = useOpenApiEditorMachineOverviewSelector(({ context }) => {
    return {
      tags: context.tags,
    };
  });
  const actorRef = useOpenApiEditorMachineOverviewRef();
  const isEditable = useEditableSection();
  return (
    <SearchableTable
      data={tags}
      label={"tag"}
      editing={isEditable}
      onAdd={() => {}}
      onFilter={(tag, filter) =>
        tag.name.toLowerCase().includes(filter.toLowerCase()) ||
        tag.description.toLowerCase().includes(filter.toLowerCase())
      }
      onRenderRow={(tag) => (
        <Tag
          name={tag.name}
          description={tag.description}
          editing={isEditable}
        />
      )}
      onRemoveAll={() => {}}
    />
  );
}

function Tag({
  name,
  description,
  editing,
}: {
  name: string;
  description: string;
  editing: boolean;
}) {
  const id = getTagId(name);
  return (
    <DataListItem aria-labelledby={id}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="name" width={2}>
              <span id={id} className={"pf-v6-u-font-weight-bold"}>
                <InlineEdit value={name} editing={editing} label={"Name"} />
              </span>
            </DataListCell>,
            <DataListCell key="description" width={5}>
              <Markdown label={"Description"} editing={editing}>
                {description}
              </Markdown>
            </DataListCell>,
          ]}
        />
        {editing && (
          <DataListAction
            aria-labelledby={`${id}-actions`}
            id={`${id}-actions`}
            aria-label="Actions"
          >
            <Button icon={<TrashIcon />} variant={"control"} />
          </DataListAction>
        )}
      </DataListItemRow>
    </DataListItem>
  );
}
