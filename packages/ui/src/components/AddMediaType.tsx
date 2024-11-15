import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Form,
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalBody,
  ModalFooter,
} from "@patternfly/react-core";
import { FunctionComponent, useCallback, useState } from "react";

interface AddMediaTypeProps {
  onAdd: () => void;
  mediaTypeSelect: string[];
}

export const AddMediaType: FunctionComponent<AddMediaTypeProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const onToggleClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    _value: string | number | undefined
  ) => {
    setIsDropdownOpen(false);
  };

  const handleOnClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <Modal
      className="addMediaType-modal"
      title={"Add Media Type"}
      isOpen={isModalOpen}
      variant="medium"
      onClose={handleOnClose}
    >
      <ModalBody className="addMediaType-modal__body">
        <div>
          <p data-testid="addMediaType-description">
            Choose a Media Type(e.g. application/json) below and then click Add.
          </p>
        </div>
        <Form>
          <FormGroup
            label="Media Type"
            isRequired
            fieldId="simple-form-mediaType"
          >
            <Dropdown
              isOpen={isDropdownOpen}
              onSelect={onSelect}
              onOpenChange={(isDropdownOpen: boolean) =>
                setIsDropdownOpen(isDropdownOpen)
              }
              toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                <MenuToggle
                  ref={toggleRef}
                  onClick={onToggleClick}
                  isExpanded={isDropdownOpen}
                >
                  application/json
                </MenuToggle>
              )}
              ouiaId="BasicDropdown"
              shouldFocusToggleOnSelect
            >
              <DropdownList>
                {props.mediaTypeSelect.map((name) => {
                  return (
                    <DropdownItem
                      data-testid={`${name}-oneof-select-dropdownitem`}
                      key={name}
                      value={name}
                    >
                      {name}
                    </DropdownItem>
                  );
                })}
              </DropdownList>
            </Dropdown>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button variant="primary" size="sm" onClick={props.onAdd}>
          Add
        </Button>
        <Button variant="secondary" size="sm" onClick={handleOnClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
