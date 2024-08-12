import { FormEvent, FunctionComponent, useCallback, useState } from 'react';
import { Button, Form, FormGroup, Modal, ModalBoxBody, ModalBoxFooter, TextArea, TextInput } from '@patternfly/react-core';

export const AddPath: FunctionComponent = () => {
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
      <p data-testid="properties-modal-description">Enter a new resource path below and then click Add.</p>
    </div>
  );

  return (
    <Modal
      className="properties-modal"
      title={"Add Path"}
      isOpen={isModalOpen}
      variant="medium"
      description={description}
      onClose={handleOnClose}>
      <ModalBoxBody className="properties-modal__body">
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
        <Button variant="primary" size="sm">
          Add
        </Button>{' '}
        <Button variant="secondary" size="sm" onClick={handleOnClose}>
          Cancel
        </Button>{' '}
      </ModalBoxFooter>
    </Modal>
  );
};
