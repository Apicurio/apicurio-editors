import {
  Accordion,
  Badge,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  SearchInput,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { CodeIcon, ReplyAllIcon, RouteIcon } from "@patternfly/react-icons";
import { useMachine } from "@xstate/react";
import { ReactNode, useEffect } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor";
import { AccordionSection } from "./AccordionSection.tsx";
import { DataTypes } from "./DataTypes";
import classes from "./EditorSidebar.module.css";
import { EditorSidebarMachine } from "./EditorSidebarMachine";
import { EditorSidebarSkeleton } from "./EditorSidebarSkeleton";
import { Paths } from "./Paths";
import { Responses } from "./Responses";

export function EditorSidebar() {
  const { paths, responses, dataTypes, filter } =
    OpenApiEditorMachineContext.useSelector((state) => ({
      paths: state.context.navigation.paths,
      responses: state.context.navigation.responses,
      dataTypes: state.context.navigation.dataTypes,
      filter: state.context.navigationFilter,
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
    <DrawerPanelContent isResizable={true} minSize={"250px"}>
      <DrawerHead className={"pf-m-sticky"}>
        <SearchInput
          placeholder={"Search everything..."}
          autoFocus={true}
          value={state.context.filter}
          onChange={(_, filter) => send({ type: "FILTER", filter })}
        />
      </DrawerHead>
      <DrawerPanelBody className={classes.sidebar}>
        <Accordion asDefinitionList={false}>
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
                      <Paths paths={paths} filtered={filtered} />
                    </PathsSection>
                    <DataTypesSection count={dataTypes.length}>
                      <DataTypes dataTypes={dataTypes} filtered={filtered} />
                    </DataTypesSection>
                    <ResponsesSection count={responses.length}>
                      <Responses responses={responses} filtered={filtered} />
                    </ResponsesSection>
                  </>
                );
            }
          })()}
        </Accordion>
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
    <AccordionSection
      title={
        <Split hasGutter={true}>
          <SplitItem>
            <RouteIcon />
          </SplitItem>
          <SplitItem isFilled={true}>Paths</SplitItem>
          <SplitItem>{count !== undefined && <Badge>{count}</Badge>}</SplitItem>
        </Split>
      }
      id={"paths"}
      isFixed={true}
    >
      {children}
    </AccordionSection>
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
    <AccordionSection
      title={
        <Split hasGutter={true}>
          <SplitItem>
            <ReplyAllIcon />
          </SplitItem>
          <SplitItem isFilled={true}>Responses</SplitItem>
          <SplitItem>{count !== undefined && <Badge>{count}</Badge>}</SplitItem>
        </Split>
      }
      id={"responses"}
      isFixed={true}
    >
      {children}
    </AccordionSection>
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
    <AccordionSection
      title={
        <Split hasGutter={true}>
          <SplitItem>
            <CodeIcon />
          </SplitItem>
          <SplitItem isFilled={true}>Data types</SplitItem>
          <SplitItem>{count !== undefined && <Badge>{count}</Badge>}</SplitItem>
        </Split>
      }
      id={"data-types"}
      isFixed={true}
    >
      {children}
    </AccordionSection>
  );
}
