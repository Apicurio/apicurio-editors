import { ReactNode } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor";
import { DataTypes } from "./DataTypes";
import { EditorSidebarSkeleton } from "./EditorSidebarSkeleton";
import { Paths } from "./Paths";
import { Responses } from "./Responses";
import { SidebarPanel } from "./SidebarPanel.tsx";
import { OmniSearch } from "./OmniSearch.tsx";
import { Grid, GridItem } from "@patternfly/react-core";

export function EditorSidebar() {
  const { value, paths, responses, dataTypes, filter, selectedNode } =
    OpenApiEditorMachineContext.useSelector(({ value, context }) => ({
      value,
      paths: context.navigation.paths,
      responses: context.navigation.responses,
      dataTypes: context.navigation.dataTypes,
      filter: context.navigationFilter,
      selectedNode: context.selectedNode,
    }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();

  const filtered = filter.length > 0;

  return (
    <Grid hasGutter={true} className="pf-v6-u-p-sm">
      <GridItem>
        <OmniSearch />
      </GridItem>
      {(() => {
        switch (value) {
          case "loading":
          case "debouncing":
          case "filtering":
            return (
              <>
                <PathsSection>
                  <EditorSidebarSkeleton />
                </PathsSection>
                <DataTypesSection>
                  <EditorSidebarSkeleton />
                </DataTypesSection>
                <ResponsesSection>
                  <EditorSidebarSkeleton />
                </ResponsesSection>
              </>
            );
          case "idle":
            return (
              <>
                <PathsSection count={paths.length}>
                  <Paths
                    paths={paths}
                    filtered={filtered}
                    onClick={(p) =>
                      actorRef.send({
                        type: "SELECT_NODE",
                        selectedNode: {
                          type: "path",
                          path: p.name,
                        },
                      })
                    }
                    isActive={(p) => p.name === selectedNode?.path}
                  />
                </PathsSection>
                <DataTypesSection count={dataTypes.length}>
                  <DataTypes
                    dataTypes={dataTypes}
                    filtered={filtered}
                    onClick={(dt) =>
                      actorRef.send({
                        type: "SELECT_NODE",
                        selectedNode: {
                          type: "datatype",
                          path: dt.name,
                        },
                      })
                    }
                    isActive={(p) => p.name === selectedNode?.path}
                  />
                </DataTypesSection>
                <ResponsesSection count={responses.length}>
                  <Responses
                    responses={responses}
                    filtered={filtered}
                    onClick={(r) =>
                      actorRef.send({
                        type: "SELECT_NODE",
                        selectedNode: {
                          type: "response",
                          path: r.name,
                        },
                      })
                    }
                    isActive={(p) => p.name === selectedNode?.path}
                  />
                </ResponsesSection>
              </>
            );
        }
      })()}
    </Grid>
  );
}

function PathsSection({
  children,
  count,
}: {
  children: ReactNode;
  count?: number;
}) {
  return (
    <SidebarPanel title={"Paths"} count={count}>
      {children}
    </SidebarPanel>
  );
}

function ResponsesSection({
  children,
  count,
}: {
  children: ReactNode;
  count?: number;
}) {
  return (
    <SidebarPanel title={"Responses"} count={count}>
      {children}
    </SidebarPanel>
  );
}

function DataTypesSection({
  children,
  count,
}: {
  children: ReactNode;
  count?: number;
}) {
  return (
    <SidebarPanel title={"Data types"} count={count}>
      {children}
    </SidebarPanel>
  );
}
