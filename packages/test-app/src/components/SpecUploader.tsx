import {
  FileUpload,
  FileUploadProps,
  Form,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  PageSection,
} from "@patternfly/react-core";
import { useState } from "react";

export function SpecUploader({
  previousSpec,
  onSpec,
}: {
  previousSpec?: string;
  onSpec: (content: string) => void;
}) {
  const [value, setValue] = useState(previousSpec);
  const [filename, setFilename] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  const handleFileInputChange: FileUploadProps["onFileInputChange"] = (
    _,
    file,
  ) => {
    setFilename(file.name);
  };

  const handleDataChange: FileUploadProps["onDataChange"] = (_event, value) => {
    setValue(value);
    onSpec(value);
  };

  const handleClear: FileUploadProps["onClearClick"] = () => {
    setFilename("");
    setValue("");
    setIsRejected(false);
  };

  const handleFileRejected = () => {
    setIsRejected(true);
  };

  const handleFileReadStarted: FileUploadProps["onReadStarted"] = () => {
    setIsLoading(true);
  };

  const handleFileReadFinished: FileUploadProps["onReadFinished"] = () => {
    setIsLoading(false);
  };

  return (
    <PageSection>
      <Form>
        <FormGroup fieldId="text-file-with-restrictions-example">
          <FileUpload
            id="text-file-with-restrictions-example"
            type="text"
            value={value}
            filename={filename}
            filenamePlaceholder="Drag and drop a file or upload one"
            onFileInputChange={handleFileInputChange}
            onDataChange={handleDataChange}
            onReadStarted={handleFileReadStarted}
            onReadFinished={handleFileReadFinished}
            onClearClick={handleClear}
            isLoading={isLoading}
            isReadOnly={true}
            dropzoneProps={{
              accept: {
                "application/json": [".json"],
                "application/x-yaml": [".yaml", ".yml"],
                "text/yaml": [".yaml", ".yml"],
              },
              onDropRejected: handleFileRejected,
            }}
            validated={isRejected ? "error" : "default"}
            browseButtonText="Upload"
          />
          <FormHelperText>
            <HelperText>
              <HelperTextItem variant={isRejected ? "error" : "default"}>
                {isRejected ? "Must be a YAML or JSON file" : "Upload a file"}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        </FormGroup>
      </Form>
    </PageSection>
  );
}
