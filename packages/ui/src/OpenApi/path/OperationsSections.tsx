import { useOpenApiEditorMachinePathSelector } from "../../useOpenApiEditorMachine.ts";
import { Operation, Operations } from "../../OpenApiEditorModels.ts";
import { Section } from "../../components/Section.tsx";
import {
  Divider,
  JumpLinks,
  JumpLinksItem,
  PageSection,
  Split,
} from "@patternfly/react-core";
import { OperationLabel } from "../../components/OperationLabel.tsx";
import { PathBreadcrumb } from "../../components/PathBreadcrumb.tsx";
import { OperationDetails } from "../../components/OperationDetails.tsx";
import { useEditableSection } from "../../components/useEditableSection.ts";
import { Fragment } from "react";

export function OperationsSections() {
  const { path } = useOpenApiEditorMachinePathSelector(({ context }) => ({
    path: context,
  }));
  return (
    <>
      <PageSection stickyOnBreakpoint={{ default: "top" }} type={"subnav"}>
        <JumpLinks
          offset={240}
          scrollableSelector={"[data-apicurio-editor]"}
          label={"Operations"}
          alwaysShowLabel={true}
        >
          {Operations.map((opName) => (
            <JumpLinksItem href={`#${opName}`}>
              <OperationLabel
                name={opName}
                isMissing={path.operations[opName] === undefined}
              />
            </JumpLinksItem>
          ))}
        </JumpLinks>
      </PageSection>
      {Operations.map((opName) => {
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
      })
        .filter((n) => !!n)
        .map((n, idx, list) => (
          <Fragment key={idx}>
            {n}
            {idx < list.length - 1 && <Divider />}
          </Fragment>
        ))}
    </>
  );
}

export function SectionOperation({ operation }: { operation: Operation }) {
  const isEditable = useEditableSection();
  return <OperationDetails operation={operation} editable={isEditable} />;
}
