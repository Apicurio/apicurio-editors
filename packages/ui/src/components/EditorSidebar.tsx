import { ReactNode } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor";
import { DataTypes } from "./DataTypes";
import { EditorSidebarSkeleton } from "./EditorSidebarSkeleton";
import { Paths } from "./Paths";
import { Responses } from "./Responses";
import { SidebarSection } from "./SidebarSection.tsx";
import { OmniSearch } from "./OmniSearch.tsx";
import { PageSection } from "@patternfly/react-core";

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
    <>
      <PageSection
        stickyOnBreakpoint={{ default: "top" }}
        style={{ boxShadow: "none" }}
      >
        <OmniSearch />
      </PageSection>
      <PageSection>
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
                      isActive={(p) =>
                        selectedNode?.type !== "validation" &&
                        p.name === selectedNode?.path
                      }
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
                      isActive={(p) =>
                        selectedNode?.type !== "validation" &&
                        p.name === selectedNode?.path
                      }
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
                      isActive={(p) =>
                        selectedNode?.type !== "validation" &&
                        p.name === selectedNode?.path
                      }
                    />
                  </ResponsesSection>
                </>
              );
          }
        })()}
      </PageSection>
    </>
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
    <SidebarSection title={"Paths"} count={count} idx={0}>
      {children}
    </SidebarSection>
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
    <SidebarSection title={"Responses"} count={count} idx={1}>
      {children}
    </SidebarSection>
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
    <SidebarSection title={"Data types"} count={count} idx={2}>
      {children}
    </SidebarSection>
  );
}
