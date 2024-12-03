import { SectionSkeleton } from "../components/SectionSkeleton.tsx";

import { PathsContext } from "./PathsContext.tsx";
import { PathDetails } from "./PathDetails.tsx";

export function PathsExplorer() {
  const { paths, searchTerm, isFiltering } = PathsContext.useSelector(
    (state) => {
      return {
        isFiltering: state.matches("debouncing"),
        paths: state.context.paths,
        searchTerm: state.context.filter,
      };
    },
  );
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
