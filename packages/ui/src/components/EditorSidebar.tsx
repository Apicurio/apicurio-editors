import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Badge,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  SearchInput,
} from "@patternfly/react-core";
import { useMachine } from "@xstate/react";
import { ReactNode, useEffect, useState } from "react";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { DataTypes } from "./DataTypes.tsx";
import classes from "./EditorSidebar.module.css";
import { EditorSidebarMachine } from "./EditorSidebarMachine.tsx";
import { EditorSidebarSkeleton } from "./EditorSidebarSkeleton.tsx";
import { Paths } from "./Paths.tsx";
import { Responses } from "./Responses.tsx";

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

function AccordionSection({
  children,
  title,
  id,
}: {
  children: ReactNode;
  title: ReactNode;
  id: string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const onToggle = () => setIsExpanded((v) => !v);
  return (
    <AccordionItem isExpanded={isExpanded}>
      <AccordionToggle onClick={onToggle} id={id}>
        {title}
      </AccordionToggle>
      <AccordionContent id={`${id}-expand`} isFixed={true}>
        {children}
      </AccordionContent>
    </AccordionItem>
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
      title={<>Paths&nbsp;{count !== undefined && <Badge>{count}</Badge>}</>}
      id={"paths"}
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
        <>Responses&nbsp;{count !== undefined && <Badge>{count}</Badge>}</>
      }
      id={"responses"}
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
        <>Data types&nbsp;{count !== undefined && <Badge>{count}</Badge>}</>
      }
      id={"data-types"}
    >
      {children}
    </AccordionSection>
  );
}
