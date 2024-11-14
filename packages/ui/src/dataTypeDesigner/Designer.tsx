import { Info } from "./Info.tsx";
import { NodeHeader } from "../components/NodeHeader.tsx";
import { useMachineSelector } from "./DataTypeDesignerMachineContext.ts";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function Designer() {
  const { dataType } = useMachineSelector(({ context }) => {
    return {
      dataType: context.dataType,
    };
  });
  return (
    <>
      <NodeHeader title={dataType.name} view={"designer"} isClosable={true} />

      <DesignerLayout info={<Info />} />
    </>
  );
}
