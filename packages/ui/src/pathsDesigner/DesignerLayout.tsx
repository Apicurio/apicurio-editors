import { Section } from "../components/Section.tsx";
import { ReactNode } from "react";
import { SectionSkeleton } from "../components/SectionSkeleton.tsx";
import {
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { PathsContext } from "./PathsContext.tsx";

export function DesignerLayout({
  paths = <SectionSkeleton />,
}: {
  paths?: ReactNode;
}) {
  const { searchTerm } = PathsContext.useSelector((state) => {
    return {
      searchTerm: state.context.filter,
    };
  });
  const actorRef = PathsContext.useActorRef();
  return (
    <Section
      title={
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
      }
      id={"paths"}
    >
      {paths}
    </Section>
  );
}
