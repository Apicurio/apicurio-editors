import { Meta, StoryFn } from '@storybook/react';
import { InlineTextEditing } from '@apicurio-editors/ui';

export default {
  title: 'Components/InlineTextEditing',
  component: InlineTextEditing,
} as Meta<typeof InlineTextEditing>;

const Template: StoryFn<typeof InlineTextEditing> = (args) => {
  return <InlineTextEditing {...args} />;
};

export const InlineTextEditingEmpty = Template.bind({});
InlineTextEditingEmpty.args = {};
