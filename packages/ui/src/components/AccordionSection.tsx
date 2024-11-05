import {
  AccordionContent,
  AccordionItem,
  AccordionToggle,
} from "@patternfly/react-core";
import { ReactNode, useState } from "react";

export function AccordionSection({
  children,
  title,
  id,
  isFixed = false,
}: {
  children: ReactNode;
  title: ReactNode;
  id: string;
  isFixed?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const onToggle = () => setIsExpanded((v) => !v);
  return (
    <AccordionItem isExpanded={isExpanded}>
      <AccordionToggle onClick={onToggle} id={id}>
        {title}
      </AccordionToggle>
      <AccordionContent id={`${id}-expand`} isFixed={isFixed}>
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
