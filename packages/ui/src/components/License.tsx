import { Button } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

export function License() {
  const { licenseName, licenseUrl } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => ({
      licenseName: context.document.licenseName,
      licenseUrl: context.document.licenseUrl,
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
