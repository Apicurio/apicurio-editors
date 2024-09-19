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
import { FunctionComponent, useState } from 'react';

interface RenameTagProps {
  isModalOpen: boolean;
  currentName: string;
  onClose: () => void;
  onRename: (newName: string) => void;
}

export const RenameTag: FunctionComponent<RenameTagProps> = ({
  isModalOpen,
  currentName,
  onRename,
  onClose
}) => {
  type validate = 'success' | 'error' | 'default';

  const [newName, setNewName] = useState<string>(currentName);
  const [validated, setValidated] = useState<validate>('default');

  const handleNameChange = (name: string) => {
    setNewName(name);
    const regex = /^[a-zA-Z0-9-]+$/;
    if (name === '') {
      setValidated('default');
    } else if (regex.test(name)) {
      setValidated('success');
    } else {
      setValidated('error');
    }
  };

  const handleRename = () => {
    onRename(newName);
    onClose();
  };

  return (
    <Modal
      position="top"
      variant={ModalVariant.medium}
      title="Rename Tag"
      isOpen={isModalOpen}
      actions={[
        <Button key="confirm" variant="primary" onClick={handleRename} isDisabled={validated === "error" || newName === ''}>
          Rename
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
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
              <TextInput value={newName} validated={validated}
                onChange={(_event, value) => handleNameChange(value)} />
              <FormHelperText>
                <HelperText>
                  {newName === "" && <HelperTextItem variant={"error"}>
                    Name is required
                  </HelperTextItem>}
                  <HelperTextItem variant={validated}>
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
