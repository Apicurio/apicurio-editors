import { ReactNode } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor";
import { EditorSidebarSkeleton } from "./EditorSidebarSkeleton";
import { SidebarSection } from "./SidebarSection.tsx";
import { Label, PageSection } from "@patternfly/react-core";
import { NavigationPaths } from "./NavigationPaths.tsx";
import { NavigationResponses } from "./NavigationResponses.tsx";
import { NavigationDataTypes } from "./NavigationDataTypes.tsx";

export function EditorSidebar() {
  const {
    isFiltering,
    view,
    paths,
    responses,
    dataTypes,
    filter,
    selectedNode,
  } = OpenApiEditorMachineContext.useSelector((state) => ({
    isFiltering: state.matches("debouncing") || state.matches("filtering"),
    view: state.context.view,
    paths: state.context.navigation.paths,
    responses: state.context.navigation.responses,
    dataTypes: state.context.navigation.dataTypes,
    filter: state.context.navigationFilter,
    selectedNode: state.context.selectedNode,
  }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();

  const filtered = filter.length > 0;

  return (
    <>
      <PageSection>
        {(() => {
          switch (isFiltering) {
            case true:
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
            default:
              return (
                <>
                  <PathsSection count={paths.length}>
                    <NavigationPaths
                      paths={paths}
                      filtered={filtered}
                      onClick={(p) => {
                        const type = (() => {
                          switch (view) {
                            case "visualize":
                              return "SELECT_PATH_VISUALIZER";
                            case "design":
                              return "SELECT_PATH_DESIGNER";
                            case "code":
                              return "SELECT_PATH_CODE";
                          }
                        })();
                        actorRef.send({
                          type,
                          path: p.path,
                          nodePath: p.nodePath,
                        });
                      }}
                      isActive={(p) =>
                        "path" in selectedNode && p.path === selectedNode?.path
                      }
                    />
                  </PathsSection>
                  <DataTypesSection count={dataTypes.length}>
                    <NavigationDataTypes
                      dataTypes={dataTypes}
                      filtered={filtered}
                      onClick={(dt) => {
                        const type = (() => {
                          switch (view) {
                            case "visualize":
                              return "SELECT_DATA_TYPE_VISUALIZER";
                            case "design":
                              return "SELECT_DATA_TYPE_DESIGNER";
                            case "code":
                              return "SELECT_DATA_TYPE_CODE";
                          }
                        })();
                        actorRef.send({
                          type,
                          name: dt.name,
                          nodePath: dt.nodePath,
                        });
                      }}
                      isActive={(p) =>
                        "name" in selectedNode && p.name === selectedNode?.name
                      }
                    />
                  </DataTypesSection>
                  <ResponsesSection count={responses.length}>
                    <NavigationResponses
                      responses={responses}
                      filtered={filtered}
                      onClick={(r) => {
                        const type = (() => {
                          switch (view) {
                            case "visualize":
                              return "SELECT_RESPONSE_VISUALIZER";
                            case "design":
                              return "SELECT_RESPONSE_DESIGNER";
                            case "code":
                              return "SELECT_RESPONSE_CODE";
                          }
                        })();
                        actorRef.send({
                          type,
                          name: r.name,
                          nodePath: r.nodePath,
                        });
                      }}
                      isActive={(p) =>
                        "name" in selectedNode && p.name === selectedNode?.name
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
    <SidebarSection
      title={<Label color={"green"}>Paths</Label>}
      count={count}
      idx={0}
    >
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
    <SidebarSection
      title={<Label color={"orange"}>Responses</Label>}
      count={count}
      idx={1}
    >
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
    <SidebarSection
      title={<Label color={"blue"}>Data types</Label>}
      count={count}
      idx={2}
    >
      {children}
    </SidebarSection>
  );
}
