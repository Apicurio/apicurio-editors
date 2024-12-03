import { DesignerLayout } from "./DesignerLayout.tsx";
import { PathsContext } from "./PathsContext.tsx";

export function PathsDesignerSkeleton() {
  return (
    <PathsContext.Provider
      options={{
        input: {
          paths: [],
        },
      }}
    >
      <DesignerLayout />
    </PathsContext.Provider>
  );
}
