import { Info } from "./Info.tsx";
import { useMachineSelector } from "./DataTypeDesignerMachineContext.ts";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function Designer() {
  const { dataType } = useMachineSelector(({ context }) => {
    return {
      dataType: context.dataType,
    };
  });
  return <DesignerLayout info={<Info />} />;
}
