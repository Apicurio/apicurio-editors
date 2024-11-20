import {
  Button,
  DataList,
  DataListCell,
  DataListCheck,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  MenuToggle,
  MenuToggleCheckbox,
  Switch,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { InlineEdit } from "../components/InlineEdit.tsx";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./DataTypeDesignerMachineContext.ts";
import { useState } from "react";

export function Properties() {
  const { properties } = useMachineSelector(({ context }) => {
    return {
      properties: context.properties,
    };
  });
  const [enableInlineEditing, setEnableInlineEditing] = useState(false);
  const actorRef = useMachineActorRef();
  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <MenuToggle
              splitButtonItems={[
                <MenuToggleCheckbox
                  id="split-button-checkbox-with-text-example"
                  key="split-checkbox-with-text"
                  aria-label="Select all"
                >
                  0 selected
                </MenuToggleCheckbox>,
              ]}
              aria-label="Menu toggle with checkbox split button and text"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Button>Add property</Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button variant={"danger"} isDisabled={true}>
              Remove selected
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Switch
              isChecked={enableInlineEditing}
              onChange={(_, checked) => setEnableInlineEditing(checked)}
              hasCheckIcon={false}
              label={"Edit properties"}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <DataList isCompact={true} aria-label={"Properties"}>
        {properties.map((p, idx) => (
          <DataListItem key={idx} aria-labelledby={`property-${idx}`}>
            <DataListItemRow>
              <DataListCheck
                id={`property-check-${idx}`}
                aria-labelledby={`property-${idx}`}
                name={`property-check-${idx}-check`}
              />
              <DataListItemCells
                dataListCells={[
                  <DataListCell key={"name"} width={2}>
                    <Title
                      headingLevel={"h3"}
                      size={"md"}
                      id={`property-${idx}`}
                    >
                      <InlineEdit
                        onChange={(newName) => {
                          actorRef.send({
                            type: "CHANGE_NAME",
                            prevName: p.name,
                            newName,
                          });
                        }}
                        value={p.name}
                        editing={!enableInlineEditing}
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
                    />
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
            {(p.description || enableInlineEditing) && (
              <DataListContent aria-label={""} hasNoPadding={true}>
                <InlineEdit
                  onChange={(newName) => {
                    actorRef.send({
                      type: "CHANGE_DESCRIPTION",
                      prevName: p.description,
                      newName,
                    });
                  }}
                  value={p.description}
                  editing={!enableInlineEditing}
                />
              </DataListContent>
            )}
          </DataListItem>
        ))}
      </DataList>
    </>
  );
}
