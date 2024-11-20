import {
  Button,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { Markdown } from "../components/Markdown.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./DocumentDesignerMachineContext.ts";
import { SearchableTable } from "../components/SearchableTable.tsx";
import { InlineEdit } from "../components/InlineEdit.tsx";

export function TagDefinitions() {
  const { tags, editable } = useMachineSelector(({ context }) => {
    return {
      tags: context.tags,
      editable: context.editable,
    };
  });
  const actorRef = useMachineActorRef();
  return (
    <SearchableTable
      data={tags}
      label={"tag"}
      editing={editable}
      onAdd={() => {}}
      onFilter={(tag, filter) =>
        tag.name.toLowerCase().includes(filter.toLowerCase()) ||
        tag.description.toLowerCase().includes(filter.toLowerCase())
      }
      onRenderRow={(tag, idx) => (
        <Tag
          id={`tag-${idx}`}
          name={tag.name}
          description={tag.description}
          editing={editable}
        />
      )}
      onRemoveAll={() => {}}
    />
  );
}

function Tag({
  id,
  name,
  description,
  editing,
}: {
  id: string;
  name: string;
  description: string;
  editing: boolean;
}) {
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
