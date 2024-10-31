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
import { ReactNode, useState } from "react";
import { fromPromise } from "xstate";
import { editorSidebarMachine } from "./EditorSidebarMachine.tsx";
import { EditorSidebarSkeleton } from "./EditorSidebarSkeleton.tsx";
import { Paths } from "./Paths.tsx";

export type EditorSidebarProps = {
  getPaths: (filter?: string) => Promise<string[]>;
};

export function EditorSidebar({ getPaths }: EditorSidebarProps) {
  const [state, send] = useMachine(
    editorSidebarMachine.provide({
      actors: { getPaths: fromPromise(({ input }) => getPaths(input)) },
    })
  );

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
      <DrawerPanelBody style={{ overflow: "auto" }}>
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
    <AccordionItem>
      <AccordionToggle onClick={onToggle} isExpanded={isExpanded} id={id}>
        {title}
      </AccordionToggle>
      <AccordionContent id={`${id}-expand`} isHidden={!isExpanded}>
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
