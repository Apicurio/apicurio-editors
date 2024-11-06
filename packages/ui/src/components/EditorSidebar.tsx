import {
  Badge,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  Grid,
  SearchInput,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { CodeIcon, ReplyAllIcon, RouteIcon } from "@patternfly/react-icons";
import { useMachine } from "@xstate/react";
import { ReactNode, useEffect } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor";
import { DataTypes } from "./DataTypes";
import classes from "./EditorSidebar.module.css";
import { EditorSidebarMachine } from "./EditorSidebarMachine";
import { EditorSidebarSkeleton } from "./EditorSidebarSkeleton";
import { Paths } from "./Paths";
import { Responses } from "./Responses";
import { CardExpandable } from "./CardExpandable.tsx";

export function EditorSidebar() {
  const { paths, responses, dataTypes, filter, selectedNode } =
    OpenApiEditorMachineContext.useSelector(({ context }) => ({
      paths: context.navigation.paths,
      responses: context.navigation.responses,
      dataTypes: context.navigation.dataTypes,
      filter: context.navigationFilter,
      selectedNode: context.selectedNode,
    }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();

  const [state, send] = useMachine(
    EditorSidebarMachine.provide({
      actions: {
        onFilter: ({ context }) =>
          actorRef.send({ type: "FILTER", filter: context.filter }),
      },
    }),
    {
      input: {
        filter,
      },
    }
  );

  useEffect(() => {
    send({ type: "UPDATE", paths });
  }, [paths]);

  const filtered = filter.length > 0;

  return (
    <DrawerPanelContent
      isResizable={true}
      minSize={"250px"}
      widths={{ default: "width_25" }}
    >
      <DrawerHead className={"pf-m-sticky"}>
        <SearchInput
          placeholder={"Search everything..."}
          autoFocus={true}
          value={state.context.filter}
          onChange={(_, filter) => send({ type: "FILTER", filter })}
        />
      </DrawerHead>
      <DrawerPanelBody className={classes.sidebar}>
        <Grid hasGutter={true}>
          {(() => {
            switch (state.value) {
              case "loading":
              case "debouncing":
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
      </DrawerPanelBody>
    </DrawerPanelContent>
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
    <CardExpandable
      title={
        <Split hasGutter={true}>
          <SplitItem>
            <RouteIcon />
          </SplitItem>
          <SplitItem isFilled={false}>Paths</SplitItem>
          <SplitItem>{count !== undefined && <Badge>{count}</Badge>}</SplitItem>
        </Split>
      }
      id={"paths"}
      isCompact={true}
      isFixed={true}
      isPlain={true}
    >
      {children}
    </CardExpandable>
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
    <CardExpandable
      title={
        <Split hasGutter={true}>
          <SplitItem>
            <ReplyAllIcon />
          </SplitItem>
          <SplitItem isFilled={false}>Responses</SplitItem>
          <SplitItem>{count !== undefined && <Badge>{count}</Badge>}</SplitItem>
        </Split>
      }
      id={"responses"}
      isCompact={true}
      isFixed={true}
      isPlain={true}
    >
      {children}
    </CardExpandable>
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
    <CardExpandable
      title={
        <Split hasGutter={true}>
          <SplitItem>
            <CodeIcon />
          </SplitItem>
          <SplitItem isFilled={false}>Data types</SplitItem>
          <SplitItem>{count !== undefined && <Badge>{count}</Badge>}</SplitItem>
        </Split>
      }
      id={"data-types"}
      isCompact={true}
      isFixed={true}
      isPlain={true}
    >
      {children}
    </CardExpandable>
  );
}
