import { Meta, StoryFn } from '@storybook/react';
import { RenameTag } from '@apicurio-editors/ui';

export default {
  title: 'Components/RenameTag',
  component: RenameTag,
} as Meta<typeof RenameTag>;

const Template: StoryFn<typeof RenameTag> = (args) => {
  return <RenameTag {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  isModalOpen: true,
  currentName: 'first tag',
};
