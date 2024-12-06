import { SectionSkeleton } from "../../components/SectionSkeleton.tsx";

import { PathDetails } from "./PathDetails.tsx";
import { useOpenApiEditorMachinePathsSelector } from "../../useOpenApiEditorMachine.ts";

export function PathsExplorer() {
  const { paths, searchTerm, isFiltering } =
    useOpenApiEditorMachinePathsSelector((state) => {
      return {
        isFiltering: state.matches("debouncing"),
        paths: state.context.filteredPaths,
        searchTerm: state.context.filter,
      };
    });
  switch (true) {
    case isFiltering:
      return <SectionSkeleton />;
    default:
      return paths.map((path) => (
        <PathDetails
          path={path}
          key={path.node.path}
          searchTerm={searchTerm}
          forceExpand={searchTerm !== ""}
        />
      ));
  }
}