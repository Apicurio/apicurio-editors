import { Meta, StoryFn } from '@storybook/react';
import { RemoveTag } from '@apicurio-editors/ui';

export default {
  title: 'Components/RemoveTag',
  component: RemoveTag,
} as Meta<typeof RemoveTag>;

const Template: StoryFn<typeof RemoveTag> = (args) => {
  return <RemoveTag {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  isModalOpen: true,
  currentName: 'first tag',
};
