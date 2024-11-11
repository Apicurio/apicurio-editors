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
  const {
    isFiltering,
    isDesignerView,
    paths,
    responses,
    dataTypes,
    filter,
    selectedNode,
  } = OpenApiEditorMachineContext.useSelector((state) => ({
    isFiltering:
      state.matches({ editor: "debouncing" }) ||
      state.matches({ editor: "filtering" }),
    isDesignerView: state.tags.has("designer"),
    paths: state.context.navigation.paths,
    responses: state.context.navigation.responses,
    dataTypes: state.context.navigation.dataTypes,
    filter: state.context.navigationFilter,
    selectedNode: state.context.node,
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
                    <Paths
                      paths={paths}
                      filtered={filtered}
                      onClick={(p) =>
                        actorRef.send({
                          type: isDesignerView
                            ? "SELECT_PATH_DESIGNER"
                            : "SELECT_PATH_CODE",
                          path: p.name,
                        })
                      }
                      isActive={(p) =>
                        "path" in selectedNode && p.name === selectedNode?.path
                      }
                    />
                  </PathsSection>
                  <DataTypesSection count={dataTypes.length}>
                    <DataTypes
                      dataTypes={dataTypes}
                      filtered={filtered}
                      onClick={(dt) =>
                        actorRef.send({
                          type: isDesignerView
                            ? "SELECT_DATA_TYPE_DESIGNER"
                            : "SELECT_DATA_TYPE_CODE",
                          path: dt.name,
                        })
                      }
                      isActive={(p) =>
                        "path" in selectedNode && p.name === selectedNode?.path
                      }
                    />
                  </DataTypesSection>
                  <ResponsesSection count={responses.length}>
                    <Responses
                      responses={responses}
                      filtered={filtered}
                      onClick={(r) =>
                        actorRef.send({
                          type: isDesignerView
                            ? "SELECT_RESPONSE_DESIGNER"
                            : "SELECT_RESPONSE_CODE",
                          path: r.name,
                        })
                      }
                      isActive={(p) =>
                        "path" in selectedNode && p.name === selectedNode?.path
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
