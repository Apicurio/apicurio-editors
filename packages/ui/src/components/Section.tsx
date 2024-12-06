import { createContext, ReactNode, useState } from "react";
import {
  Badge,
  Flex,
  FlexItem,
  PageSection,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Switch,
  Title,
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
      <PageSection>
        <Stack id={id} hasGutter={true}>
          <StackItem>
            <Flex>
              <FlexItem flex={{ default: "flex_1" }}>
                <Split hasGutter={true}>
                  <SplitItem>
                    <Title headingLevel={"h2"}>{title}</Title>
                  </SplitItem>
                  {count !== undefined && (
                    <SplitItem>
                      <Badge>{count}</Badge>
                    </SplitItem>
                  )}
                </Split>
              </FlexItem>
              <FlexItem>
                <Switch
                  isChecked={mode === "designer"}
                  onChange={toggleMode}
                  label={"Edit"}
                />
              </FlexItem>
            </Flex>
          </StackItem>
          <StackItem>{children}</StackItem>
        </Stack>
      </PageSection>
    </SectionContext.Provider>
  );
}
