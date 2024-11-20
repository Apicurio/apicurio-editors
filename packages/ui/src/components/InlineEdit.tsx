import {
  Button,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupItem,
  TextInput,
} from "@patternfly/react-core";
import { CheckIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import {
  FormEventHandler,
  FunctionComponent,
  KeyboardEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import classes from "./InlineEdit.module.css";

type ValidationResult = {
  status: "default" | "success" | "error";
  errMessages: string[];
};

interface IInlineEdit {
  value?: string;
  label?: string;
  validator?: (value: string) => ValidationResult;
  onChange?: (value: string) => void;
  onClick?: () => void;
  editing?: boolean;
  autoFocus?: boolean;
}

export const InlineEdit: FunctionComponent<IInlineEdit> = (props) => {
  const [localValue, setLocalValue] = useState(props.value ?? "");
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [validationResult, setValidationResult] = useState<ValidationResult>({
    status: "default",
    errMessages: [],
  });

  const onChange = useCallback(
    (_event: unknown, value: string) => {
      setLocalValue(value);

      if (value === props.value) {
        setValidationResult({ status: "default", errMessages: [] });
        return;
      }

      if (typeof props.validator === "function") {
        setValidationResult(props.validator(value));
      }
    },
    [props]
  );

  const saveValue = useCallback(() => {
    if (
      validationResult.status !== "default" &&
      validationResult.status !== "success"
    )
      return;

    setIsReadOnly(true);
    if (localValue !== props.value && typeof props.onChange === "function") {
      props.onChange(localValue);
    }
  }, [localValue, props, validationResult]);

  const cancelValue = useCallback(() => {
    setLocalValue(props.value ?? "");
    setValidationResult({ status: "default", errMessages: [] });
    setIsReadOnly(true);
  }, [props.value]);

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.key === "Enter") {
        saveValue();
      }
      if (event.key === "Escape") {
        cancelValue();
      }
      event.stopPropagation();
    },
    [cancelValue, saveValue]
  );

  const onSave: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      saveValue();
      event.stopPropagation();
    },
    [saveValue]
  );

  const noop: FormEventHandler<HTMLFormElement> = useCallback((event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    setLocalValue(props.value ?? "");
    setIsReadOnly(false);
  }, [props.value]);

  const isChanged = props.value !== localValue;

  return (
    <>
      {!props.editing ? (
        <>
          <span
            className={classes.inlineEdit}
            data-clickable={typeof props.onClick === "function"}
            onClick={props.onClick}
          >
            {props.value ? (
              props.value
            ) : (
              <span className={"pf-v6-u-text-color-disabled"}>
                No value provided
              </span>
            )}
          </span>
        </>
      ) : (
        <Form onSubmit={noop}>
          <FormGroup type="text" fieldId="edit-value" label={props.label}>
            <InputGroup>
              <InputGroupItem isFill>
                <TextInput
                  id="edit-value"
                  name="edit-value"
                  aria-label="edit-value"
                  type="text"
                  onChange={onChange}
                  value={localValue}
                  aria-invalid={validationResult.status === "error"}
                  onKeyDown={onKeyDown}
                  isDisabled={isReadOnly}
                  autoFocus={props.autoFocus}
                />
                <FormHelperText>
                  <HelperText>
                    <HelperTextItem
                      variant={validationResult.status}
                      {...(validationResult.status === "error" && {
                        icon: <ExclamationCircleIcon />,
                      })}
                    >
                      {validationResult.errMessages[0]}
                    </HelperTextItem>
                  </HelperText>
                </FormHelperText>
              </InputGroupItem>

              <InputGroupItem>
                <Button
                  icon={<CheckIcon />}
                  variant="control"
                  aria-label="save button for editing value"
                  onClick={onSave}
                  isDisabled={validationResult.status === "error" || !isChanged}
                />
              </InputGroupItem>
            </InputGroup>
          </FormGroup>
        </Form>
      )}
    </>
  );
};
