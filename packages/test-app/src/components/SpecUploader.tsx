import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  FileUpload,
  FileUploadProps,
  Form,
  FormGroup,
  FormHelperText,
  Gallery,
  HelperText,
  HelperTextItem,
  Icon,
  PageSection,
  Stack,
  StackItem,
  Title,
} from "@patternfly/react-core";
import { useState } from "react";
import { ExclamationTriangleIcon } from "@patternfly/react-icons";

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

  const loadSpec = async (
    specType: "registry" | "rebilly" | "github" | "stripe",
  ) => {
    const spec = await (() => {
      switch (specType) {
        case "registry":
          return import("../_test-data/openapi-registry-v3.json");
        case "rebilly":
          return import("../_test-data/rebilly-rest-api.json");
        case "github":
          return import("../_test-data/github-v3-rest-api.json");
        case "stripe":
          return import("../_test-data/stripe-api.json");
        default:
          throw new Error("Unsupported spec type");
      }
    })();
    const specContent: string = JSON.stringify(spec);
    onSpec(specContent);
  };

  return (
    <>
      <PageSection>
        <Form>
          <FormGroup fieldId="text-file-with-restrictions-example">
            <FileUpload
              id="text-file-with-restrictions-example"
              type="text"
              hideDefaultPreview={true}
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
                  {isRejected ? "Must be a YAML or JSON file" : ""}
                </HelperTextItem>
              </HelperText>
            </FormHelperText>
          </FormGroup>
        </Form>
      </PageSection>
      <PageSection>
        <Stack hasGutter={true}>
          <Title headingLevel={"h2"}>Spec samples</Title>
          <Gallery
            hasGutter={true}
            minWidths={{
              default: "400px",
            }}
          >
            <Card isClickable={true}>
              <CardHeader
                selectableActions={{
                  onClickAction: () => loadSpec("registry"),
                  selectableActionAriaLabelledby: "registry",
                }}
              >
                <CardTitle id="registry">Apicurio Registry v3</CardTitle>
              </CardHeader>
              <CardBody>
                This OpenAPI spec includes features like path-based operations
                (CRUD for artifacts, rules, metadata), reusable components
                (schemas, responses), query and path parameters, content
                negotiation, version management, and detailed error handling. It
                supports advanced features like artifact branching, global
                rules, and admin tasks (export/import, configuration).{" "}
              </CardBody>
              <CardFooter>
                Document size: <strong>190KB</strong>
              </CardFooter>
            </Card>
            <Card isClickable={true}>
              <CardHeader
                selectableActions={{
                  onClickAction: () => loadSpec("rebilly"),
                  selectableActionAriaLabelledby: "rebilly",
                }}
              >
                <CardTitle id="rebilly">Rebilly REST Api</CardTitle>
              </CardHeader>
              <CardBody>
                The OpenAPI spec includes features like multi-server support,
                detailed authentication options (API keys, JWT, client-side
                HMAC), path-based operations with reusable components (schemas,
                parameters, responses), error handling, pagination,
                rate-limiting, and support for diverse resources (customers,
                payments, subscriptions, files). It integrates customization
                options like rules and custom fields.{" "}
              </CardBody>
              <CardFooter>
                Document size: <strong>838KB</strong>
              </CardFooter>
            </Card>
            <Card isClickable={true}>
              <CardHeader
                selectableActions={{
                  onClickAction: () => loadSpec("github"),
                  selectableActionAriaLabelledby: "github",
                }}
              >
                <CardTitle id="github">GitHub v3 REST Api</CardTitle>
              </CardHeader>
              <CardBody>
                This OpenAPI spec for GitHub's v3 REST API includes features
                such as multi-server support, path-based operations with
                reusable components (schemas, responses, parameters),
                pagination, authentication mechanisms (OAuth, JWT), error
                handling, and support for diverse resources (e.g., gists, repos,
                issues, actions, and apps). It also provides extensive
                documentation links, rate-limiting endpoints, and support for
                metadata retrieval and customization options.{" "}
              </CardBody>
              <CardFooter>
                <Stack hasGutter={true}>
                  <StackItem>
                    Document size: <strong>11MB</strong>
                  </StackItem>
                  <i>
                    <Icon status={"warning"}>
                      <ExclamationTriangleIcon />
                    </Icon>{" "}
                    Editing this specification requires using the provided web
                    workers for optimal performance
                  </i>
                </Stack>
              </CardFooter>
            </Card>
            <Card isClickable={true}>
              <CardHeader
                selectableActions={{
                  onClickAction: () => loadSpec("stripe"),
                  selectableActionAriaLabelledby: "stripe",
                }}
              >
                <CardTitle id="stripe">Stripe REST Api</CardTitle>
              </CardHeader>
              <CardBody>
                The Stripe REST API specification extensively uses advanced
                OpenAPI features like reusable components (schemas, responses),
                and complex data types (anyOf, oneOf). It also includes vendor
                extensions for field expansion and polymorphic resources
              </CardBody>
              <CardFooter>
                <Stack hasGutter={true}>
                  <StackItem>
                    Document size: <strong>6.7MB</strong>
                  </StackItem>
                  <i>
                    <Icon status={"warning"}>
                      <ExclamationTriangleIcon />
                    </Icon>{" "}
                    Editing this specification requires using the provided web
                    workers for optimal performance
                  </i>
                </Stack>
              </CardFooter>
            </Card>
          </Gallery>
        </Stack>
      </PageSection>
    </>
  );
}
