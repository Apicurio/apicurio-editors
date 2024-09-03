import { Button, ExpandableSection, Form, FormGroup, Grid, GridItem, TextInput } from '@patternfly/react-core';
import { TrashIcon } from '@patternfly/react-icons';
import { FunctionComponent, useState } from 'react';

interface InlineTextEditingProps {
  deleteUser: () => void;
}

export const InlineTextEditing: FunctionComponent<InlineTextEditingProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  return (
    <>
      <Grid>
        <GridItem span={11}>
          <ExpandableSection toggleText={"CONTACT"} onToggle={onToggle} isExpanded={isExpanded}>
            <Form>
              <FormGroup
                label="Name"
                fieldId="simple-form-tag-01"
              >
                <TextInput
                  type="text"
                  id="simple-form-extension-01"
                  name="simple-form-extension-01"
                  aria-describedby="simple-form-extension-01-helper"
                  placeholder='No contact provided.'
                />
              </FormGroup>
              <FormGroup
                label="Email"
                fieldId="simple-form-tag-02"
              >
                <TextInput
                  type="text"
                  id="simple-form-extension-02"
                  name="simple-form-extension-02"
                  aria-describedby="simple-form-extension-02-helper"
                  placeholder='No email provided.'
                />
              </FormGroup>
              <FormGroup
                label="URL"
                fieldId="simple-form-tag-03"
              >
                <TextInput
                  type="text"
                  id="simple-form-extension-03"
                  name="simple-form-extension-03"
                  aria-describedby="simple-form-extension-03-helper"
                  placeholder='No URL provided.'
                />
              </FormGroup>
            </Form>
          </ExpandableSection >
        </GridItem>
        <GridItem span={1}>
          <Button variant="link" icon={<TrashIcon />} size="sm" onClick={() => { props.deleteUser }}>
          </Button>
        </GridItem>
      </Grid>
    </>
  );
};
