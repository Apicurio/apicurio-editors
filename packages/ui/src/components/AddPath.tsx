import { Button, Form, FormGroup, Modal, ModalBoxBody, ModalBoxFooter, TextInput } from '@patternfly/react-core';
import { FormEvent, FunctionComponent, useCallback, useState } from 'react';

interface AddPathProps {
  onAdd: () => void;
}

export const AddPath: FunctionComponent<AddPathProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [path, setPath] = useState('/');

  const handlePathChange = (_event: FormEvent<HTMLInputElement>, path: string) => {
    setPath(path);
  };

  const handleOnClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const description = (
    <div>
      <p data-testid="addPath-description">Enter a new resource path below and then click Add.</p>
    </div>
  );

  return (
    <Modal
      className="addPath-modal"
      title={"Add Path"}
      isOpen={isModalOpen}
      variant="medium"
      description={description}
      onClose={handleOnClose}>
      <ModalBoxBody className="addPath-modal__body">
        <Form>
          <FormGroup
            label="Path"
            isRequired
            fieldId="simple-form-path-01"
          >
            <TextInput
              isRequired
              type="text"
              id="simple-form-path-01"
              name="simple-form-path-01"
              aria-describedby="simple-form-path-01-helper"
              value={path}
              onChange={handlePathChange}
            />
          </FormGroup>
        </Form>
      </ModalBoxBody>
      <ModalBoxFooter>
        <Button variant="primary" size="sm" onClick={props.onAdd}>
          Add
        </Button>
        <Button variant="secondary" size="sm" onClick={handleOnClose}>
          Cancel
        </Button>
      </ModalBoxFooter>
    </Modal>
  );
};
