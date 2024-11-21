import { Info } from "./Info.tsx";
import { Servers } from "./Servers.tsx";
import { useMachineSelector } from "./PathDesignerMachineContext.ts";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function Designer() {
  const { path } = useMachineSelector(({ context }) => {
    return {
      path: context.node,
      summary: context.summary,
      description: context.description,
    };
  });
  return <DesignerLayout info={<Info />} servers={<Servers />} />;
}
