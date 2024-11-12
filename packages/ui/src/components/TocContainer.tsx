import { PropsWithChildren } from "react";
import classes from "./Toc.module.css";
import { Stack } from "@patternfly/react-core";

export function TocContainer({ children }: PropsWithChildren) {
  return (
    <Stack hasGutter={true} className={classes.content}>
      {children}
    </Stack>
  );
}
