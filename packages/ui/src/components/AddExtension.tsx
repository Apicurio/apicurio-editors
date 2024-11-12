import { CodeEditor, Language } from "@patternfly/react-code-editor";
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
  TextInput,
} from "@patternfly/react-core";
import { FunctionComponent, useCallback, useState } from "react";

interface AddExtensionProps {
  onAdd: () => void;
  extensionNameSelect: string[];
}

export const AddExtension: FunctionComponent<AddExtensionProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const handleOnClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const onChange = (value: string) => {
    // eslint-disable-next-line no-console
    console.log(value);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const onToggleClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    // eslint-disable-next-line no-console
    console.log("selected", value);
    setIsDropdownOpen(false);
  };

  return (
    <Modal
      className="addExtension-modal"
      title={"Add Extension"}
      isOpen={isModalOpen}
      variant="medium"
      onClose={handleOnClose}
    >
      <ModalBody className="addExtension-modal__body">
        <div>
          <p data-testid="addExtension-modal-description">
            Enter information about the new extension below and then click{" "}
            <b>Add</b>.
          </p>
        </div>
        <Form>
          <FormGroup label="Name" isRequired>
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
                  Custom property
                </MenuToggle>
              )}
              ouiaId="BasicDropdown"
              shouldFocusToggleOnSelect
            >
              <DropdownList>
                {props.extensionNameSelect.map((name) => {
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
          <FormGroup isRequired>
            <TextInput
              isRequired
              type="text"
              id="simple-form-extension-01"
              name="simple-form-extension-01"
              aria-describedby="simple-form-extension-01-helper"
              defaultValue="x-"
            />
          </FormGroup>
          <FormGroup label="Value">
            <CodeEditor
              isLineNumbersVisible={true}
              isReadOnly={false}
              onChange={onChange}
              language={Language.json}
              height="300px"
            />
          </FormGroup>
        </Form>
        <p>The fields marked with * are required.</p>
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
