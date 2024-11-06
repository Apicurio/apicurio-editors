import { SearchInput } from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

export function OmniSearch() {
  const { filter } = OpenApiEditorMachineContext.useSelector(({ context }) => ({
    filter: context.navigationFilter,
  }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <SearchInput
      placeholder={"Search everything..."}
      autoFocus={true}
      value={filter}
      onChange={(_, filter) => actorRef.send({ type: "FILTER", filter })}
    />
  );
}
