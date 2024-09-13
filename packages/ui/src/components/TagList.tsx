import { CodeEditor } from "@patternfly/react-code-editor";
import { PencilAltIcon, TagIcon, TrashIcon } from "@patternfly/react-icons";
import { ActionsColumn, ExpandableRowContent, IAction, Table, Tbody, Td, Tr } from "@patternfly/react-table";
import { FunctionComponent, useState } from "react";

interface Tag {
  name: string;
  description: string;
}

interface TagListProps {
  tagList: Tag[];
}

export const TagList: FunctionComponent<TagListProps> = ({ tagList }) => {

  const [expandedTagNames, setExpandedTagNames] = useState<string[]>([]);

  const setTagExpanded = (tagName: string, isExpanding = true) => {
    setExpandedTagNames(prevExpanded => {
      const otherExpandedTags = prevExpanded.filter(name => name !== tagName);
      return isExpanding ? [...otherExpandedTags, tagName] : otherExpandedTags;
    });
  };

  const isTagExpanded = (tagName: string) => expandedTagNames.includes(tagName);

  const defaultActions = (): IAction[] => [
    {
      title: <>
        <PencilAltIcon /> Rename
      </>,
      onClick: () => { }
    },
    {
      title: <>
        <TrashIcon /> Delete
      </>,
      onClick: () => { }
    }
  ];

  return (
    <Table aria-label="Tag List">
      {tagList.map((tag, rowIndex) => (
        <Tbody key={tag.name} isExpanded={isTagExpanded(tag.name)}>
          <Tr>
            <Td
              expand={{
                rowIndex,
                isExpanded: isTagExpanded(tag.name),
                onToggle: () => setTagExpanded(tag.name, !isTagExpanded(tag.name)),
                expandId: 'tag-expandable'
              }}
            />
            <Td dataLabel="Name"><><TagIcon /> {tag.name}</></Td>
            <Td dataLabel="Tag Description">{tag.description}</Td>
            <Td isActionCell>
              <ActionsColumn items={defaultActions()} />
            </Td>
          </Tr>
          {isTagExpanded(tag.name) && (
            <Tr isExpanded={isTagExpanded(tag.name)}>
              <Td colSpan={2}>
                <ExpandableRowContent><CodeEditor
                  height="200px"
                  code={tag.description}
                /></ExpandableRowContent>
              </Td>
            </Tr>
          )}
        </Tbody>
      ))}
    </Table>
  )

}
