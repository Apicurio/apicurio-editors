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
  mode: "viewer" | "designer";
  toggleView: () => void;
}>({
  mode: "viewer",
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
  const [mode, setMode] = useState<"viewer" | "designer">("viewer");
  const toggleMode = () =>
    setMode((v) => (v === "viewer" ? "designer" : "viewer"));
  return (
    <SectionContext.Provider value={{ mode, toggleView: toggleMode }}>
      <Card isPlain={true} isLarge={true} id={id}>
        <CardHeader
          actions={{
            actions: (
              <Switch
                isChecked={mode === "designer"}
                onChange={toggleMode}
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
