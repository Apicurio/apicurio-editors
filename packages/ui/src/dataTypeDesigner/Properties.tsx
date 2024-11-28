import {
  Button,
  DataListAction,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Switch,
  Title,
} from "@patternfly/react-core";
import { InlineEdit } from "../components/InlineEdit.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./DataTypeDesignerMachineContext.ts";
import { Markdown } from "../components/Markdown.tsx";
import { DataTypeProperty } from "../OpenApiEditorModels.ts";
import { SearchableTable } from "../components/SearchableTable.tsx";
import { TrashIcon } from "@patternfly/react-icons";
import { useEditableSection } from "./useEditableSection.ts";

export function Properties() {
  const { properties } = useMachineSelector(({ context }) => {
    return {
      properties: context.properties,
    };
  });
  const actorRef = useMachineActorRef();
  const isEditable = useEditableSection();
  return (
    <SearchableTable
      data={properties}
      label={"property"}
      editing={isEditable}
      onFilter={(p, filter) =>
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.type.toLowerCase().includes(filter.toLowerCase())
      }
      onRenderRow={(p, idx) => (
        <Property idx={idx} editing={isEditable} p={p} />
      )}
      onAdd={() => {}}
      onRemoveAll={() => {}}
    />
  );
}

function Property({
  idx,
  editing,
  p,
}: {
  idx: number;
  editing: boolean;
  p: DataTypeProperty;
}) {
  return (
    <DataListItem aria-labelledby={`property-${idx}`}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={"name"} width={2}>
              <Title headingLevel={"h3"} size={"md"} id={`property-${idx}`}>
                <InlineEdit
                  label={"Name"}
                  onChange={() => {}}
                  value={p.name}
                  editing={editing}
                />
              </Title>
            </DataListCell>,
            <DataListCell key={"type"} width={4}>
              {p.type}
            </DataListCell>,
            <DataListCell width={1} key={"required"}>
              <Switch
                isChecked={p.required}
                hasCheckIcon={false}
                label={"Required"}
                isDisabled={!editing}
              />
            </DataListCell>,
          ]}
        />
        {editing && (
          <DataListAction
            aria-labelledby={`${idx}-actions`}
            id={`${idx}-actions`}
            aria-label="Actions"
          >
            <Button icon={<TrashIcon />} variant={"control"} />
          </DataListAction>
        )}
      </DataListItemRow>
      {(p.description || editing) && (
        <DataListContent aria-label={""} hasNoPadding={true}>
          <Markdown label={"Description"} onChange={() => {}} editing={editing}>
            {p.description ?? ""}
          </Markdown>
        </DataListContent>
      )}
    </DataListItem>
  );
}
