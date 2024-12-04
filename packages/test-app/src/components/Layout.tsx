import {
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Page,
  PageSidebar,
  PageSidebarBody,
  PageToggleButton,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import { ReactNode, useState } from "react";
import { MoonIcon, SunIcon } from "@patternfly/react-icons";
import viteImg from "/vite.svg";
import { useAppContext } from "../AppContext.tsx";

export function Layout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(true);
  const {
    showDebugger,
    setDebugger,
    showXStateInspector,
    setXStateInspector,
    showReactScan,
    setReactScan,
    spec,
    setSpec,
  } = useAppContext();

  const hasSpec = spec !== undefined;

  const onSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const setLightMode = (value: boolean) => {
    setIsLightMode(value);
    document
      .getElementsByTagName("html")[0]
      .classList.toggle("pf-v6-theme-dark");
  };

  const headerToolbar = (
    <Toolbar>
      <ToolbarContent>
        <ToolbarGroup alignSelf={"center"}>
          <ToolbarItem>
            <Switch
              checked={showDebugger}
              label={"Show editor debugger"}
              onChange={(_, v) => setDebugger(v)}
              isDisabled={!hasSpec}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Switch
              checked={showXStateInspector}
              label={"Show XState inspector"}
              onChange={(_, v) => setXStateInspector(v)}
              isDisabled={hasSpec}
            />
          </ToolbarItem>
          <ToolbarItem>
            <Switch
              checked={showReactScan}
              label={"Enable React Scan"}
              onChange={(_, v) => setReactScan(v)}
            />
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup align={{ default: "alignEnd" }}>
          <ToolbarItem>
            <ToggleGroup>
              <ToggleGroupItem
                icon={<SunIcon />}
                aria-label="Light mode"
                isSelected={isLightMode}
                onChange={() => {
                  setLightMode(true);
                }}
              />
              <ToggleGroupItem
                icon={<MoonIcon />}
                aria-label="Dark mode"
                isSelected={!isLightMode}
                onChange={() => {
                  setLightMode(false);
                }}
              />
            </ToggleGroup>
          </ToolbarItem>
        </ToolbarGroup>
      </ToolbarContent>
    </Toolbar>
  );

  const masthead = (
    <Masthead>
      <MastheadMain style={{ gridColumn: "1 / -1" }}>
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
        <MastheadBrand>
          <MastheadLogo onClick={() => setSpec(undefined)} component={"a"}>
            <img src={viteImg} />
          </MastheadLogo>
        </MastheadBrand>
        <MastheadContent style={{ width: "100%" }}>
          {headerToolbar}
        </MastheadContent>
      </MastheadMain>
    </Masthead>
  );

  const sidebar = (
    <PageSidebar isSidebarOpen={isSidebarOpen}>
      <PageSidebarBody>Navigation</PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page masthead={masthead} isContentFilled={true} sidebar={sidebar}>
      {children}
    </Page>
  );
}
