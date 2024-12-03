import { DesignerLayout } from "./DesignerLayout.tsx";
import { Paths } from "./Paths.tsx";
import { PathsContext } from "./PathsContext.tsx";
import { useMachineSelector } from "./PathsDesignerMachineContext.ts";

export function Designer() {
  const { allPaths } = useMachineSelector(({ context }) => {
    return {
      allPaths: context.paths,
    };
  });
  return (
    <PathsContext.Provider
      options={{
        input: {
          paths: allPaths,
        },
      }}
    >
      <DesignerLayout paths={<Paths />} />;
    </PathsContext.Provider>
  );
}
