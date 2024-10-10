import { Button, TextInput } from "@patternfly/react-core";
import {
  CheckIcon,
  PencilAltIcon,
  TagIcon,
  TimesIcon,
  TrashIcon,
} from "@patternfly/react-icons";
import {
  ActionsColumn,
  IAction,
  Table,
  Tbody,
  Td,
  Tr,
} from "@patternfly/react-table";
import { FunctionComponent, useCallback, useState } from "react";

export type Tag = {
  name: string;
  description: string;
};

export type TagListProps = {
  tagList: Tag[];
};

export const TagList: FunctionComponent<TagListProps> = ({ tagList }) => {
  const [editingTagName, setEditingTagName] = useState<string | null>(null);
  const [currentDescription, setCurrentDescription] = useState<string>("");
  const [updatedTagList, setUpdatedTagList] = useState<Tag[]>(tagList);

  const handleDescriptionClick = useCallback(
    (tagName: string, description: string) => {
      setEditingTagName(tagName);
      setCurrentDescription(description);
    },
    [],
  );

  const updateDescription = useCallback(
    (tagName: string) => {
      const updatedTags = updatedTagList.map((tag) =>
        tag.name === tagName
          ? { ...tag, description: currentDescription }
          : tag,
      );
      setUpdatedTagList(updatedTags);
      setEditingTagName(null);
    },
    [updatedTagList, currentDescription],
  );

  const cancelEditing = useCallback(() => {
    setEditingTagName(null);
    setCurrentDescription("");
  }, []);

  const isEditingTag = (tagName: string) => editingTagName === tagName;

  const defaultActions = (): IAction[] => [
    {
      title: (
        <>
          <PencilAltIcon />
          &nbsp;Rename
        </>
      ),
      onClick: () => {},
    },
    {
      title: (
        <>
          <TrashIcon />
          &nbsp;Delete
        </>
      ),
      onClick: () => {},
    },
  ];

  return (
    <Table aria-label="Tag List">
      {updatedTagList.map((tag) => (
        <Tbody key={tag.name}>
          <Tr>
            <Td dataLabel="Name">
              <>
                <TagIcon /> {tag.name}
              </>
            </Td>
            <Td dataLabel="Tag Description">
              {isEditingTag(tag.name) ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextInput
                    value={currentDescription}
                    onChange={(_event, value) => setCurrentDescription(value)}
                    aria-label="Edit tag description"
                  />
                  <Button
                    variant="plain"
                    aria-label="Save description"
                    onClick={() => updateDescription(tag.name)}
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    variant="plain"
                    aria-label="Cancel edit"
                    onClick={cancelEditing}
                  >
                    <TimesIcon />
                  </Button>
                </div>
              ) : (
                <span
                  onClick={() =>
                    handleDescriptionClick(tag.name, tag.description)
                  }
                >
                  {tag.description || "No description provided."}
                  <Button
                    variant="plain"
                    aria-label="Edit description"
                    onClick={() =>
                      handleDescriptionClick(tag.name, tag.description)
                    }
                  >
                    <PencilAltIcon />
                  </Button>
                </span>
              )}
            </Td>
            <Td isActionCell>
              <ActionsColumn items={defaultActions()} />
            </Td>
          </Tr>
        </Tbody>
      ))}
    </Table>
  );
};
