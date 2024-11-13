import { Button } from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import {
  useMachineActorRef,
  useMachineSelector,
} from "./DocumentDesignerMachineContext.ts";

export function License() {
  const { licenseName, licenseUrl } = useMachineSelector(({ context }) => {
    return {
      licenseName: context.licenseName,
      licenseUrl: context.licenseUrl,
    };
  });
  const actorRef = useMachineActorRef();
  return (
    <Button variant={"link"} href={licenseUrl}>
      {licenseName}&nbsp;
      <ExternalLinkAltIcon />
    </Button>
  );
}
