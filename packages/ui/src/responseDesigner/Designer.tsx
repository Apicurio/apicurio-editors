import { Info } from "./Info.tsx";
import { NodeHeader } from "../components/NodeHeader.tsx";
import { useMachineSelector } from "./ResponseDesignerMachineContext.ts";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function Designer() {
  const { response } = useMachineSelector(({ context }) => {
    return {
      response: context.response,
    };
  });
  return (
    <>
      <NodeHeader title={response.name} view={"designer"} isClosable={true} />

      <DesignerLayout info={<Info />} />
    </>
  );
}
