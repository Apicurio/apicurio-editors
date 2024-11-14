import { Skeleton, Stack } from "@patternfly/react-core";
import classes from "./FadeInSkeleton.module.css";

export function SectionSkeleton() {
  return (
    <Stack hasGutter={true} className={classes.skeleton}>
      <Skeleton width={"75%"} />
      <Skeleton width={"35%"} />
      <Skeleton width={"58%"} />
    </Stack>
  );
}
