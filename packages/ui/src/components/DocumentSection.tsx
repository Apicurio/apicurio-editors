import { ReactNode } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardTitle,
  Divider,
  Split,
  SplitItem,
} from "@patternfly/react-core";

export function DocumentSection({
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
    <Card isPlain={true} id={id}>
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
      <Divider />
      <CardBody>{children}</CardBody>
    </Card>
  );
}
