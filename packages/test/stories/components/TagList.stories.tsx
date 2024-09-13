import { Meta, StoryFn } from '@storybook/react';
import { TagList } from '@apicurio-editors/ui';

export default {
  title: 'Components/TagList',
  component: TagList,
} as Meta<typeof TagList>;

const Template: StoryFn<typeof TagList> = (args) => {
  return <TagList {...args} />;
};

export const ListOfTags = Template.bind({});
ListOfTags.args = {
  tagList: [{ name: "first api", description: "first api tags" }]
};
