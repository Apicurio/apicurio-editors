import { Button } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

export function DocumentRootLicense() {
  const { licenseName, licenseUrl } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => {
      if (context.node.type !== "root") throw new Error("Invalid node type");
      return {
        licenseName: context.node.node.licenseName,
        licenseUrl: context.node.node.licenseUrl,
      };
    }
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <Button variant={"link"} href={licenseUrl}>
      {licenseName}&nbsp;
      <ExternalLinkAltIcon />
    </Button>
  );
}
