import { Button } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

export function License() {
  const { licenseName, licenseUrl } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => ({
      licenseName: context.documentRoot.licenseName,
      licenseUrl: context.documentRoot.licenseUrl,
    })
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <Button variant={"link"} href={licenseUrl}>
      {licenseName}&nbsp;
      <ExternalLinkAltIcon />
    </Button>
  );
}
