import { Flex, FlexItem, LabelGroup, Title } from "@patternfly/react-core";
import { useOpenApiEditorMachinePathSelector } from "../../useOpenApiEditorMachine.ts";
import { Operations } from "../../OpenApiEditorModels.ts";
import { OperationLabel } from "../../components/OperationLabel.tsx";
import { PathBreadcrumb } from "../../components/PathBreadcrumb.tsx";

export function Header() {
  const { path, operations } = useOpenApiEditorMachinePathSelector(
    ({ context }) => {
      return {
        path: context.node.path,
        operations: context.operations,
      };
    },
  );
  return (
    <Flex alignItems={{ default: "alignItemsCenter" }}>
      <FlexItem>
        <LabelGroup>
          {Operations.map((opName) => {
            const o = operations[opName];
            if (o !== undefined) {
              return <OperationLabel name={opName} key={opName} />;
            }
          })}
        </LabelGroup>
      </FlexItem>
      <FlexItem>
        <Title headingLevel={"h1"}>
          <PathBreadcrumb path={path} />
        </Title>
      </FlexItem>
    </Flex>
  );
}
