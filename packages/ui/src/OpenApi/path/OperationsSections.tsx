import { useOpenApiEditorMachinePathSelector } from "../../useOpenApiEditorMachine.ts";
import { Operation, Operations } from "../../OpenApiEditorModels.ts";
import { Section } from "../../components/Section.tsx";
import { Split } from "@patternfly/react-core";
import { OperationLabel } from "../../components/OperationLabel.tsx";
import { PathBreadcrumb } from "../../components/PathBreadcrumb.tsx";
import { OperationDetails } from "../../components/OperationDetails.tsx";
import { useEditableSection } from "../../components/useEditableSection.ts";

export function OperationsSections() {
  const { path } = useOpenApiEditorMachinePathSelector(({ context }) => ({
    path: context,
  }));
  return Operations.map((opName) => {
    const operation = path.operations[opName];
    if (operation !== undefined) {
      return (
        <Section
          title={
            <Split hasGutter>
              <OperationLabel name={opName} />
              <PathBreadcrumb path={path.node.path} />
            </Split>
          }
          id={opName}
          key={`path-${path.node.nodePath}-${opName}`}
        >
          <SectionOperation operation={operation} />
        </Section>
      );
    }
  });
}

export function SectionOperation({ operation }: { operation: Operation }) {
  const isEditable = useEditableSection();
  return <OperationDetails operation={operation} editable={isEditable} />;
}
