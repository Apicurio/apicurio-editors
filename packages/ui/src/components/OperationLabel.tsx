import { Operations } from "../OpenApiEditorModels.ts";
import { Label, LabelProps } from "@patternfly/react-core";

export function OperationLabel({
  name,
  isMissing,
}: {
  name: (typeof Operations)[number];
  isMissing?: boolean;
}) {
  const variant: LabelProps["variant"] = isMissing ? "outline" : "filled";
  switch (name) {
    case "get":
      return (
        <Label color={"green"} variant={variant}>
          Get
        </Label>
      );
    case "put":
      return (
        <Label color={"teal"} variant={variant}>
          Put
        </Label>
      );
    case "post":
      return (
        <Label color={"orange"} variant={variant}>
          Post
        </Label>
      );
    case "delete":
      return (
        <Label color={"red"} variant={variant}>
          Delete
        </Label>
      );
    case "options":
      return (
        <Label color={"purple"} variant={variant}>
          Options
        </Label>
      );
    case "head":
      return (
        <Label color={"purple"} variant={variant}>
          Head
        </Label>
      );
    case "patch":
      return (
        <Label color={"purple"} variant={variant}>
          Patch
        </Label>
      );
    case "trace":
      return (
        <Label color={"purple"} variant={variant}>
          Trace
        </Label>
      );
  }
}
