import '@patternfly/react-core/dist/styles/base.css';
import { Meta, StoryFn } from '@storybook/react';
import { AddMediaType } from '@apicurio-editors/ui';

export default {
  title: 'Components/AddMediaType',
  component: AddMediaType,
} as Meta<typeof AddMediaType>;

const Template: StoryFn<typeof AddMediaType> = (args) => {
  return <AddMediaType {...args} />;
};

export const AddMediaTypeEmpty = Template.bind({});
AddMediaTypeEmpty.args = {
  mediaTypeSelect: ["application/json", "text/xml", "multipart/form-data"],
};
