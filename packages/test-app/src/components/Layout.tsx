import {
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  MastheadToggle,
  Page,
  PageToggleButton,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import { ReactNode, useState } from "react";
import { MoonIcon, SunIcon } from "@patternfly/react-icons";
import viteImg from "/vite.svg";
import { useAppContext } from "../AppContext.tsx";

export function Layout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLightMode, setIsLightMode] = useState(true);
  const { showDebugger, setDebugger, showXStateInspector, setXStateInspector } =
    useAppContext();

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
        <ToolbarItem alignSelf={"center"}>
          <Switch
            checked={showDebugger}
            label={"Show editor debugger"}
            onChange={(_, v) => setDebugger(v)}
          />
        </ToolbarItem>
        <ToolbarItem alignSelf={"center"}>
          <Switch
            checked={showXStateInspector}
            label={"Show XState inspector"}
            onChange={(_, v) => setXStateInspector(v)}
          />
        </ToolbarItem>
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
          <img src={viteImg} />
        </MastheadBrand>
        <MastheadContent>{headerToolbar}</MastheadContent>
      </MastheadMain>
    </Masthead>
  );

  return (
    <Page masthead={masthead} isContentFilled={true}>
      {children}
    </Page>
  );
}
