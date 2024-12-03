import { createContext, ReactNode, useState } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Split,
  SplitItem,
  Switch,
} from "@patternfly/react-core";

export const SectionContext = createContext<{
  view: "viewer" | "designer";
  toggleView: () => void;
}>({
  view: "viewer",
  toggleView: () => {},
});

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
  const [view, setView] = useState<"viewer" | "designer">("viewer");
  const toggleView = () =>
    setView((v) => (v === "viewer" ? "designer" : "viewer"));
  return (
    <SectionContext.Provider value={{ view, toggleView }}>
      <Card isPlain={true} isLarge={true} id={id}>
        <CardHeader
          actions={{
            actions: (
              <Switch
                isChecked={view === "designer"}
                onChange={toggleView}
                label={"Edit"}
              />
            ),
            hasNoOffset: true,
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
    </SectionContext.Provider>
  );
}
