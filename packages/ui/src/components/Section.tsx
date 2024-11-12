import { ReactNode } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardTitle,
  Split,
  SplitItem,
} from "@patternfly/react-core";

export function Section({
  title,
  count,
  id,
  children,
}: {
  title: ReactNode;
  count?: number;
  id: string;
  children: ReactNode;
}) {
  return (
    <Card isPlain={true} isLarge={true} id={id}>
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
      <CardBody>{children}</CardBody>
    </Card>
  );
}
