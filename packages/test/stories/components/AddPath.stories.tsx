import '@patternfly/react-core/dist/styles/base.css';
import { Meta, StoryFn } from '@storybook/react';
import { AddPath } from '@apicurio-editors/ui';

export default {
  title: 'Components/AddPath',
  component: AddPath,
} as Meta<typeof AddPath>;

const Template: StoryFn<typeof AddPath> = (args) => {
  return <AddPath {...args} />;
};

export const AddPathEmpty = Template.bind({});
AddPathEmpty.args = {};
