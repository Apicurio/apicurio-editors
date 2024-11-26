import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  DataList,
  DataListCell,
  DataListContent,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  DataListToggle,
  Label,
  LabelGroup,
  SearchInput,
  Stack,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { DocumentPath, Operation, Operations } from "../OpenApiEditorModels.ts";
import { useMachineSelector } from "./DocumentDesignerMachineContext.ts";
import { Markdown } from "../components/Markdown.tsx";
import { Path } from "../components/Path.tsx";
import { TagLabel } from "./TagLabel.tsx";
import { assign, setup } from "xstate";
import { useMachine } from "@xstate/react";
import { SectionSkeleton } from "../components/SectionSkeleton.tsx";
import { useMemo, useState } from "react";

const machine = setup({
  types: {
    context: {} as {
      paths: DocumentPath[];
      initialPaths: DocumentPath[];
      filter: string;
    },
    events: {} as { readonly type: "SEARCH"; filter: string },
    input: {} as {
      paths: DocumentPath[];
    },
  },
}).createMachine({
  id: "pathsExplorer",
  context: ({ input }) => ({
    paths: input.paths,
    initialPaths: input.paths,
    filter: "",
  }),
  initial: "idle",
  states: {
    idle: {
      entry: assign({
        paths: ({ context: { initialPaths } }) => initialPaths,
      }),
    },
    filtered: {
      entry: assign({
        paths: ({ context: { paths, filter } }) =>
          paths.filter(
            (path) =>
              path.node.path.toLowerCase().includes(filter.toLowerCase()) ||
              path.description?.toLowerCase().includes(filter.toLowerCase()) ||
              path.summary?.toLowerCase().includes(filter.toLowerCase())
          ),
      }),
    },
    debouncing: {
      after: {
        200: [
          {
            target: "filtered",
            guard: ({ context: { filter } }) => filter.length > 0,
          },
          {
            target: "idle",
          },
        ],
      },
    },
  },
  on: {
    SEARCH: {
      target: ".debouncing",
      actions: assign({ filter: ({ event }) => event.filter }),
      reenter: true,
    },
  },
});

export function PathsExplorer() {
  const { allPaths } = useMachineSelector(({ context }) => {
    return {
      allPaths: context.paths,
    };
  });
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const [state, send] = useMachine(machine, {
    input: {
      paths: allPaths,
    },
  });

  return (
    <Stack hasGutter={true}>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <SearchInput
              onChange={(_, filter) => send({ type: "SEARCH", filter })}
              onClear={() => send({ type: "SEARCH", filter: "" })}
              value={state.context.filter}
              placeholder={"Find anywhere"}
            />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      {(() => {
        switch (state.value) {
          case "debouncing":
            return <SectionSkeleton />;
          case "idle":
          case "filtered":
            return state.context.paths.map((path, idx) => (
              <Card key={path.node.path} isCompact={true} isClickable={true}>
                <CardHeader
                  selectableActions={{
                    onClickAction: () =>
                      actorRef.send({
                        type: "SELECT_PATH_VISUALIZER",
                        path: path.node.path,
                        nodePath: path.node.nodePath,
                      }),
                    selectableActionAriaLabelledby: `path-title-${idx}`,
                  }}
                >
                  <CardTitle id={`path-title-${idx}`}>
                    <Path path={path.node.path} />
                  </CardTitle>
                </CardHeader>
                {path.summary && (
                  <CardBody>
                    <Markdown>{path.summary}</Markdown>
                  </CardBody>
                )}
                <CardBody>
                  <DataList aria-label={"Path operations"}>
                    {Operations.map((opName) => {
                      const o = path.operations[opName];
                      if (o !== undefined) {
                        return (
                          <OperationRow
                            key={opName}
                            operation={o}
                            idx={idx}
                            name={opName}
                            forceExpanded={state.value === "filtered"}
                          />
                        );
                      }
                    })}
                  </DataList>
                </CardBody>
              </Card>
            ));
        }
      })()}
    </Stack>
  );
}

function OperationRow({
  operation,
  idx,
  name,
  forceExpanded,
}: {
  operation: Operation;
  idx: number;
  name: string;
  forceExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isExpanded = useMemo(
    () => forceExpanded || expanded,
    [forceExpanded, expanded]
  );
  return (
    <DataListItem
      aria-labelledby={`path-${idx}-operation-${name}`}
      isExpanded={isExpanded}
    >
      <DataListItemRow>
        <DataListToggle
          onClick={() => setExpanded((e) => !e)}
          isExpanded={expanded}
          id={`path-${idx}-operation-${name}-toggle`}
          aria-controls={`path-${idx}-operation-${name}-expand`}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell isFilled={false} key={"operation"}>
              {name === "get" && <Label color={"green"}>Get</Label>}
              {name === "put" && <Label color={"teal"}>Put</Label>}
              {name === "post" && <Label color={"orange"}>Post</Label>}
              {name === "delete" && <Label color={"red"}>Delete</Label>}
              {name === "head" && <Label color={"purple"}>Head</Label>}
              {name === "patch" && <Label color={"purple"}>Patch</Label>}
              {name === "trace" && <Label color={"purple"}>Trace</Label>}
            </DataListCell>,
            <DataListCell key={"info"}></DataListCell>,
          ]}
        />
      </DataListItemRow>
      <DataListContent
        aria-label={"Path info"}
        isHidden={!isExpanded}
        hasNoPadding={true}
        id={`path-${idx}-operation-${name}-expand`}
      >
        <Stack hasGutter={true}>
          {operation.description && (
            <Markdown>{operation.description}</Markdown>
          )}
          <LabelGroup>
            {operation.tags.map((t) => (
              <TagLabel key={t} name={t} />
            ))}
          </LabelGroup>
        </Stack>
      </DataListContent>
    </DataListItem>
  );
}
