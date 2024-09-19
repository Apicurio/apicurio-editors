import { CodeEditor, CodeEditorControl } from '@patternfly/react-code-editor';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import {
  CheckIcon,
  PencilAltIcon,
  TagIcon,
  TimesIcon,
  TrashIcon,
} from '@patternfly/react-icons';
import {
  ActionsColumn,
  ExpandableRowContent,
  IAction,
  Table,
  Tbody,
  Td,
  Tr,
} from '@patternfly/react-table';
import { FunctionComponent, useState } from 'react';

interface Tag {
  name: string;
  description: string;
}

interface TagListProps {
  tagList: Tag[];
}

export const TagList: FunctionComponent<TagListProps> = ({ tagList }) => {
  const [expandedTagNames, setExpandedTagNames] = useState<string[]>([]);
  const [editingTagName, setEditingTagName] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState<string>('');
  const [updatedTagList, setUpdatedTagList] = useState<Tag[]>(tagList); 

  const setTagExpanded = (tagName: string, isExpanding = true) => {
    setExpandedTagNames((prevExpanded) => {
      const otherExpandedTags = prevExpanded.filter((name) => name !== tagName);
      return isExpanding ? [...otherExpandedTags, tagName] : otherExpandedTags;
    });
  };

  const isEditingTag = (tagName: string) => editingTagName === tagName;

  const handleDescriptionClick = (tagName: string, description: string) => {
    setEditingTagName(tagName);
    setCurrentCode(description);
  };

  const updateDescription = (tagName: string) => {
    const updatedTags = updatedTagList.map((tag) => {
      if (tag.name === tagName) {
        return { ...tag, description: currentCode };
      }
      return tag;
    });
    setUpdatedTagList(updatedTags);
    setEditingTagName(null); 
  };

  const isTagExpanded = (tagName: string) => expandedTagNames.includes(tagName);

  const defaultActions = (): IAction[] => [
    {
      title: (
        <>
          <PencilAltIcon />
          &nbsp;Rename
        </>
      ),
      onClick: () => { },
    },
    {
      title: (
        <>
          <TrashIcon />
          &nbsp;Delete
        </>
      ),
      onClick: () => { },
    },
  ];

  const editCustomControl = (
    <CodeEditorControl
      icon={<CheckIcon color="blue" />}
      aria-label="Save code"
      tooltipProps={{ content: 'Save' }}
      onClick={() => editingTagName && updateDescription(editingTagName)} 
    />
  );

  const cancelCustomControl = (
    <CodeEditorControl
      icon={<TimesIcon />}
      aria-label="Cancel edit"
      tooltipProps={{ content: 'Cancel edit' }}
      onClick={() => setEditingTagName(null)} 
    />
  );

  return (
    <Table aria-label="Tag List">
      {updatedTagList.map((tag, rowIndex) => (
        <Tbody key={tag.name} isExpanded={isTagExpanded(tag.name)}>
          <Tr>
            <Td
              expand={{
                rowIndex,
                isExpanded: isTagExpanded(tag.name),
                onToggle: () =>
                  setTagExpanded(tag.name, !isTagExpanded(tag.name)),
                expandId: 'tag-expandable',
              }}
            />
            <Td dataLabel="Name">
              <>
                <TagIcon /> {tag.name}
              </>
            </Td>
            <Td dataLabel="Tag Description">{tag.description}</Td>
            <Td isActionCell>
              <ActionsColumn items={defaultActions()} />
            </Td>
          </Tr>
          {isTagExpanded(tag.name) && (
            <Tr isExpanded={isTagExpanded(tag.name)}>
              <Td colSpan={2}>
                <ExpandableRowContent>
                  <DescriptionList>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Description</DescriptionListTerm>
                      <DescriptionListDescription
                        onClick={() =>
                          handleDescriptionClick(tag.name, tag.description)
                        }
                      >
                        {tag.description}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                  {isEditingTag(tag.name) && (
                    <CodeEditor
                      height="200px"
                      code={currentCode}
                      onChange={(value) => setCurrentCode(value || '')}
                      customControls={[editCustomControl, cancelCustomControl]}
                    />
                  )}
                </ExpandableRowContent>
              </Td>
            </Tr>
          )}
        </Tbody>
      ))}
    </Table>
  );
};
