import { Title } from "@patternfly/react-core";
import { useOpenApiEditorMachinePathSelector } from "../../useOpenApiEditorMachine.ts";
import { PathBreadcrumb } from "../../components/PathBreadcrumb.tsx";

export function Header() {
  const { path } = useOpenApiEditorMachinePathSelector(({ context }) => {
    return {
      path: context.node.path,
    };
  });
  return (
    <Title headingLevel={"h1"}>
      <PathBreadcrumb path={path} />
    </Title>
  );
}
