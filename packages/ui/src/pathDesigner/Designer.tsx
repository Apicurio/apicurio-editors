import { Info } from "./Info.tsx";
import { Servers } from "./Servers.tsx";
import { NodeHeader } from "../components/NodeHeader.tsx";
import { useMachineSelector } from "./PathDesignerMachineContext.ts";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function Designer() {
  const { path } = useMachineSelector(({ context }) => {
    return {
      path: context.path,
      summary: context.summary,
      description: context.description,
    };
  });
  return (
    <>
      <NodeHeader title={path.path} view={"designer"} isClosable={true} />

      <DesignerLayout info={<Info />} servers={<Servers />} />
    </>
  );
}
