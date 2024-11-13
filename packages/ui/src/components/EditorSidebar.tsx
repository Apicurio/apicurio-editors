import { ReactNode } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor";
import { EditorSidebarSkeleton } from "./EditorSidebarSkeleton";
import { SidebarSection } from "./SidebarSection.tsx";
import { OmniSearch } from "./OmniSearch.tsx";
import { PageSection } from "@patternfly/react-core";
import { NavigationPaths } from "./NavigationPaths.tsx";
import { NavigationResponses } from "./NavigationResponses.tsx";
import { NavigationDataTypes } from "./NavigationDataTypes.tsx";

export function EditorSidebar() {
  const {
    isFiltering,
    isDesignerView,
    paths,
    responses,
    dataTypes,
    filter,
    selectedNode,
  } = OpenApiEditorMachineContext.useSelector((state) => ({
    isFiltering: state.matches("debouncing") || state.matches("filtering"),
    isDesignerView: state.context.view === "designer",
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
      <PageSection
        stickyOnBreakpoint={{ default: "top" }}
        style={{ boxShadow: "none" }}
      >
        <OmniSearch />
      </PageSection>
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
                      onClick={(p) =>
                        actorRef.send({
                          type: isDesignerView
                            ? "SELECT_PATH_DESIGNER"
                            : "SELECT_PATH_CODE",
                          path: p.path,
                          nodePath: p.nodePath,
                        })
                      }
                      isActive={(p) =>
                        "path" in selectedNode && p.path === selectedNode?.path
                      }
                    />
                  </PathsSection>
                  <DataTypesSection count={dataTypes.length}>
                    <NavigationDataTypes
                      dataTypes={dataTypes}
                      filtered={filtered}
                      onClick={(dt) =>
                        actorRef.send({
                          type: isDesignerView
                            ? "SELECT_DATA_TYPE_DESIGNER"
                            : "SELECT_DATA_TYPE_CODE",
                          name: dt.name,
                          nodePath: dt.nodePath,
                        })
                      }
                      isActive={(p) =>
                        "name" in selectedNode && p.name === selectedNode?.name
                      }
                    />
                  </DataTypesSection>
                  <ResponsesSection count={responses.length}>
                    <NavigationResponses
                      responses={responses}
                      filtered={filtered}
                      onClick={(r) =>
                        actorRef.send({
                          type: isDesignerView
                            ? "SELECT_RESPONSE_DESIGNER"
                            : "SELECT_RESPONSE_CODE",
                          name: r.name,
                          nodePath: r.nodePath,
                        })
                      }
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
