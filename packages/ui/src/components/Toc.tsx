import { PropsWithChildren } from "react";
import classes from "./Toc.module.css";
import { JumpLinks, JumpLinksList } from "@patternfly/react-core";

export function Toc({ children }: PropsWithChildren) {
  return (
    <JumpLinks
      className={classes.toc}
      scrollableSelector={".apicurio-editor .pf-v6-c-drawer__panel-main"}
      isVertical={true}
      expandable={{ default: "expandable", "2xl": "nonExpandable" }}
      label={"Table of contents"}
      offset={177}
      style={{ top: 127 }}
    >
      <JumpLinksList>{children}</JumpLinksList>
    </JumpLinks>
  );
}
