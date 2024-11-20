import { SearchInput } from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";

export function OmniSearch() {
  const { filter, isExpanded } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => ({
      filter: context.navigationFilter,
      isExpanded: context.showNavigation,
    })
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <SearchInput
      placeholder={"Search everything..."}
      autoFocus={true}
      value={filter}
      onChange={(_, filter) => actorRef.send({ type: "FILTER", filter })}
      expandableInput={{
        isExpanded,
        onToggleExpand: () => {
          if (isExpanded) {
            actorRef.send({ type: "HIDE_NAVIGATION" });
            actorRef.send({ type: "FILTER", filter: "" });
          } else {
            actorRef.send({ type: "SHOW_NAVIGATION" });
          }
        },
        toggleAriaLabel: "Expandable search input toggle",
      }}
    />
  );
}
