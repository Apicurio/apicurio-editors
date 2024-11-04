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
import classes from "./EditorSidebar.module.css";
import { EditorSidebarMachine } from "./EditorSidebarMachine.tsx";
import { EditorSidebarSkeleton } from "./EditorSidebarSkeleton.tsx";
import { Paths } from "./Paths.tsx";

export function EditorSidebar() {
  const { paths, filter } = OpenApiEditorMachineContext.useSelector(
    (state) => ({
      paths: state.context.navigation.paths,
      filter: state.context.navigationFilter,
    })
  );
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
        paths,
        filter,
      },
    }
  );

  useEffect(() => {
    send({ type: "UPDATE", paths });
  }, [paths]);

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
                  <PathsSection>
                    <EditorSidebarSkeleton />
                  </PathsSection>
                );
              case "idle":
                return (
                  <PathsSection count={state.context.paths.length}>
                    <Paths paths={state.context.paths} />
                  </PathsSection>
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
