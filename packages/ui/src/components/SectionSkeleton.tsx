import { Skeleton, Stack } from "@patternfly/react-core";

export function SectionSkeleton() {
  return (
    <Stack hasGutter={true}>
      <Skeleton width={"75%"} />
      <Skeleton width={"35%"} />
      <Skeleton width={"58%"} />
    </Stack>
  );
}