import {
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Badge,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { ReactNode, useState } from "react";

export function AccordionSection({
  children,
  title,
  id,
  count,
  isFixed = false,
}: {
  children: ReactNode;
  title: ReactNode;
  id: string;
  count?: number;
  isFixed?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const onToggle = () => setIsExpanded((v) => !v);
  return (
    <AccordionItem isExpanded={isExpanded}>
      <AccordionToggle onClick={onToggle} id={id}>
        <Split hasGutter={true}>
          <SplitItem>{title}</SplitItem>
          {count && count >= 0 ? (
            <SplitItem>
              <Badge>{count}</Badge>
            </SplitItem>
          ) : null}
        </Split>
      </AccordionToggle>
      <AccordionContent id={`${id}-expand`} isFixed={isFixed}>
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
