import { Section } from "../../components/Section.tsx";
import { ReactNode } from "react";
import { SectionSkeleton } from "../../components/SectionSkeleton.tsx";
import {
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  useOpenApiEditorMachinePathsRef,
  useOpenApiEditorMachinePathsSelector,
} from "../../useOpenApiEditorMachine.ts";
import { Sections } from "../../components/Sections.tsx";

export function PathsLayout({
  paths = <SectionSkeleton />,
}: {
  paths?: ReactNode;
}) {
  const { searchTerm } = useOpenApiEditorMachinePathsSelector((state) => {
    return {
      searchTerm: state.context.filter,
    };
  });
  const actorRef = useOpenApiEditorMachinePathsRef();
  return (
    <Sections>
      <Section title={"Paths"} id={"paths"}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <SearchInput
                onChange={(_, filter) => {
                  actorRef.send({ type: "SEARCH", filter });
                }}
                onClear={() => {
                  actorRef.send({ type: "SEARCH", filter: "" });
                }}
                value={searchTerm}
                placeholder={"Filter by anything"}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
        {paths}
      </Section>
    </Sections>
  );
}
