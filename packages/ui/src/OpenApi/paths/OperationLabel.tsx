import { Operations } from "../../OpenApiEditorModels.ts";
import { Label } from "@patternfly/react-core";

export function OperationLabel({
  name,
}: {
  name: (typeof Operations)[number];
}) {
  switch (name) {
    case "get":
      return <Label color={"green"}>Get</Label>;
    case "put":
      return <Label color={"teal"}>Put</Label>;
    case "post":
      return <Label color={"orange"}>Post</Label>;
    case "delete":
      return <Label color={"red"}>Delete</Label>;
    case "head":
      return <Label color={"purple"}>Head</Label>;
    case "patch":
      return <Label color={"purple"}>Patch</Label>;
    case "trace":
      return <Label color={"purple"}>Trace</Label>;
  }
}
