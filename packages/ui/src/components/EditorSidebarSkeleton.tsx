import { Flex, Skeleton } from "@patternfly/react-core";

export function EditorSidebarSkeleton() {
  return (
    <Flex flexWrap={{ default: "wrap" }} direction={{ default: "column" }}>
      <Skeleton width={"30%"} />
      <Skeleton width={"55%"} />
      <Skeleton width={"70%"} />
      <Skeleton width={"40%"} />
      <Skeleton width={"60%"} />
      <Skeleton width={"20%"} />
      <Skeleton width={"35%"} />
    </Flex>
  );
}
