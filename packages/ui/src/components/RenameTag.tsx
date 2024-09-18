import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Modal,
  ModalVariant,
  Stack,
  StackItem,
  TextInput,
} from '@patternfly/react-core';
import { FunctionComponent } from 'react';

interface RenameTagProps {
  isModalOpen: boolean;
  currentName: string;
  newName: string;
}

export const RenameTag: FunctionComponent<RenameTagProps> = ({
  isModalOpen,
  currentName,
  newName,
}) => {
  return (
    <Modal
      position="top"
      variant={ModalVariant.medium}
      title="Rename Tag"
      isOpen={isModalOpen}
      actions={[
        <Button key="confirm" variant="primary" onClick={() => { }}>
          Rename
        </Button>,
        <Button key="cancel" variant="link" onClick={() => { }}>
          Cancel
        </Button>,
      ]}
    >
      <Stack hasGutter>
        <StackItem>
          <Alert
            variant="info"
            title={
              'You should know!Renaming a Tag will also update any references to that tag elsewhere in the API (e.g. tagging on operations).'
            }
          />
        </StackItem>
        <StackItem>
          <Form isHorizontal>
            <FormGroup label="Current name">
              <TextInput readOnlyVariant="plain" value={currentName} />
            </FormGroup>
            <FormGroup label="New name" isRequired>
              <TextInput value={newName} />
              <FormHelperText>
                <HelperText>
                  <HelperTextItem>
                    Enter a valid name (only alpha-numeric characters are
                    allowed - no whitespace).
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            </FormGroup>
          </Form>
        </StackItem>
      </Stack>
    </Modal>
  );
};
