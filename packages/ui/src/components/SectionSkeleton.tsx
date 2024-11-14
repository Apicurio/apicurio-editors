import { Skeleton, Stack } from "@patternfly/react-core";
import classes from "./FadeInSkeleton.module.css";
import { Fragment } from "react";

export function SectionSkeleton({ count = 1 }: { count?: number }) {
  return (
    <Stack hasGutter={true} className={classes.skeleton}>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Fragment key={i}>
            <Skeleton width={"75%"} />
            <Skeleton width={"35%"} />
            <Skeleton width={"58%"} />
          </Fragment>
        ))}
    </Stack>
  );
}
