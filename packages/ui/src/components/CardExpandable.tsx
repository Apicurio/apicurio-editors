import { ReactNode, useState } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardExpandableContent,
  CardHeader,
  CardTitle,
  Split,
  SplitItem,
} from "@patternfly/react-core";

export function CardExpandable({
  title,
  count,
  id,
  isCompact = false,
  isFixed = false,
  isPlain = false,
  children,
}: {
  title: ReactNode;
  count?: number;
  id: string;
  isCompact?: boolean;
  isFixed?: boolean;
  isPlain?: boolean;
  children: ReactNode;
}) {
  const [isExpanded, setExpanded] = useState(true);
  return (
    <Card
      isExpanded={isExpanded}
      isCompact={isCompact}
      isPlain={isPlain}
      id={id}
    >
      <CardHeader
        onExpand={() => setExpanded(!isExpanded)}
        toggleButtonProps={{
          id: `${id}-toggle`,
          "aria-label": "Details",
          "aria-labelledby": `expandable-card-title ${id}-toggle`,
          "aria-expanded": isExpanded,
        }}
      >
        <CardTitle>
          <Split hasGutter={true}>
            <SplitItem>{title}</SplitItem>
            {count !== undefined && (
              <SplitItem>
                <Badge>{count}</Badge>
              </SplitItem>
            )}
          </Split>
        </CardTitle>
      </CardHeader>
      <CardExpandableContent>
        <CardBody
          style={isFixed ? { overflow: "auto", maxHeight: "20rem" } : {}}
        >
          {children}
        </CardBody>
      </CardExpandableContent>
    </Card>
  );
}
