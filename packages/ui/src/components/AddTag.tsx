import { Button, Form, FormGroup, Modal, ModalBoxBody, ModalBoxFooter, TextArea, TextInput } from '@patternfly/react-core';
import { ChangeEvent, FormEvent, FunctionComponent, useCallback, useState } from 'react';

interface AddTagProps {
  onAdd: () => void;
}

export const AddTag: FunctionComponent<AddTagProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');

  const handleTagChange = (_event: FormEvent<HTMLInputElement>, tag: string) => {
    setTag(tag);
  };

  const handleDescriptionChange = (_event: ChangeEvent<HTMLTextAreaElement>, description: string) => {
    setDescription(description);
  };

  const handleOnClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const tagDescription = (
    <div>
      <p data-testid="addTag-modal-description">Enter information about the new tag below and Click <b>Add</b>.</p>
    </div>
  );

  return (
    <Modal
      className="addTag-modal"
      title={"Add Tag"}
      isOpen={isModalOpen}
      variant="medium"
      description={tagDescription}
      onClose={handleOnClose}>
      <ModalBoxBody className="addTag-modal__body">
        <Form>
          <FormGroup
            label="Tag"
            isRequired
            fieldId="simple-form-tag-01"
          >
            <TextInput
              isRequired
              type="text"
              id="simple-form-tag-01"
              name="simple-form-tag-01"
              aria-describedby="simple-form-tag-01-helper"
              value={tag}
              onChange={handleTagChange}
            />
          </FormGroup>
          <FormGroup label="Description" fieldId="simple-form-description-01">
            <TextArea
              isRequired
              type="description"
              id="simple-form-description-01"
              name="simple-form-description-01"
              value={description}
              onChange={handleDescriptionChange}
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
