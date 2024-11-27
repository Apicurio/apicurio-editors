import { ReactNode } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { PencilAltIcon } from "@patternfly/react-icons";

export function Section({
  title,
  count,
  id,
  children,
  onEdit,
}: {
  title: ReactNode;
  count?: number;
  id: string;
  children: ReactNode;
  onEdit?: () => void;
}) {
  return (
    <Card isPlain={true} isLarge={true} id={id}>
      <CardHeader
        actions={{
          actions: (
            <>
              {onEdit && (
                <Button
                  variant={"control"}
                  icon={<PencilAltIcon />}
                  onClick={onEdit}
                />
              )}
            </>
          ),
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
      <CardBody>{children}</CardBody>
    </Card>
  );
}
