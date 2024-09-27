import '@patternfly/react-core/dist/styles/base.css';
import { Meta, StoryFn } from '@storybook/react';
import { AddResponse } from '@apicurio-editors/ui';

export default {
  title: 'Components/AddResponse',
  component: AddResponse,
} as Meta<typeof AddResponse>;

const Template: StoryFn<typeof AddResponse> = (args) => {
  return <AddResponse {...args} />;
};

export const AddResponseEmpty = Template.bind({});
AddResponseEmpty.args = {
  initialSelectOptions: [
    { value: '200 OK', children: '200 OK' },
    { value: '201 Created', children: '201 Created' },
    { value: '204 No Content', children: '204 No Content' },
    { value: '400 Bad Request', children: '400 Bad Request' },
    { value: '401 Unauthorized', children: '401 Unauthorized' },
    { value: '403 Forbidden', children: '403 Forbidden' },
    { value: '404 Not Found', children: '404 Not Found' }
    ],
};
