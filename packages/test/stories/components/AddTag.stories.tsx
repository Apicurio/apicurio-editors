import { Meta, StoryFn } from '@storybook/react';
import { AddTag } from '@apicurio-editors/ui';

export default {
  title: 'Components/AddTag',
  component: AddTag,
} as Meta<typeof AddTag>;

const Template: StoryFn<typeof AddTag> = (args) => {
  return <AddTag {...args} />;
};

export const AddTagEmpty = Template.bind({});
AddTagEmpty.args = {};
