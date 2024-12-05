import { Button } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import {
  useOpenApiEditorMachineOverviewRef,
  useOpenApiEditorMachineOverviewSelector,
} from "../../useOpenApiEditorMachine.ts";

export function License() {
  const { licenseName, licenseUrl } = useOpenApiEditorMachineOverviewSelector(
    ({ context }) => {
      return {
        licenseName: context.licenseName,
        licenseUrl: context.licenseUrl,
      };
    },
  );
  const actorRef = useOpenApiEditorMachineOverviewRef();
  return (
    <Button variant={"link"} href={licenseUrl}>
      {licenseName}&nbsp;
      <ExternalLinkAltIcon />
    </Button>
  );
}
