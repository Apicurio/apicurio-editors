import {
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Page,
  PageToggleButton,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import { ReactNode, useState } from "react";

export function Layout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const onSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const headerToolbar = (
    <Toolbar id="vertical-toolbar">
      <ToolbarContent>
        <ToolbarItem>header-tools</ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton
            variant="plain"
            aria-label="Global navigation"
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={onSidebarToggle}
            id="vertical-nav-toggle"
          >
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadBrand href="https://patternfly.org" target="_blank">
          Logo
        </MastheadBrand>
        <MastheadContent>{headerToolbar}</MastheadContent>
      </MastheadMain>
    </Masthead>
  );

  return <Page masthead={masthead}>{children}</Page>;
}
