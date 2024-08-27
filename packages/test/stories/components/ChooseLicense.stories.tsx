import { Meta, StoryFn } from '@storybook/react';
import { ChooseLicense } from '@apicurio-editors/ui';

export default {
  title: 'Components/ChooseLicense',
  component: ChooseLicense,
} as Meta<typeof ChooseLicense>;

const Template: StoryFn<typeof ChooseLicense> = (args) => {
  return <ChooseLicense {...args} />;
};

export const ChooseLicenseEmpty = Template.bind({});
ChooseLicenseEmpty.args = {};
