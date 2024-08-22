import '@patternfly/react-core/dist/styles/base.css';
import { Meta, StoryFn } from '@storybook/react';
import { AddExtension } from '@apicurio-editors/ui';

export default {
  title: 'Components/AddExtension',
  component: AddExtension,
} as Meta<typeof AddExtension>;

const Template: StoryFn<typeof AddExtension> = (args) => {
  return <AddExtension {...args} />;
};

export const AddExtensionEmpty = Template.bind({});
AddExtensionEmpty.args = {
  extensionNameSelect: ["Custom property", "Second property", "Third property"],
};
