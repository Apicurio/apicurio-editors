import {
  Button,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
} from "@patternfly/react-core";
import { Markdown } from "./Markdown.tsx";
import { TrashIcon } from "@patternfly/react-icons";
import { InlineEdit } from "./InlineEdit.tsx";

export function ServerRow({
  id,
  url,
  description,
  editing,
  onRemove,
}: {
  id: string;
  url: string;
  description: string;
  editing: boolean;
  onRemove: () => void;
}) {
  return (
    <DataListItem aria-labelledby={id}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="url" width={2}>
              <span id={id}>
                <InlineEdit label={"Url"} value={url} editing={editing} />
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
