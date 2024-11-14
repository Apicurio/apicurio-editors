import { Truncate } from "@patternfly/react-core";
import { Fragment } from "react";

export function Path({ path }: { path: string }) {
  const pathParts = path.split("/");
  return (
    <Truncate
      content={
        pathParts.map((p, idx, list) => (
          <Fragment key={idx}>
            {p.startsWith("{") && p.endsWith("}") ? (
              <span
                className={"pf-v6-u-text-color-link pf-v6-u-font-weight-bold"}
              >
                {p}
              </span>
            ) : (
              p
            )}
            {idx < list.length - 1 && (
              <span className={"pf-v6-u-text-color-disabled"}>/</span>
            )}
          </Fragment>
        )) as unknown as string
      }
    />
  );
}
