import React, { useState } from "react";
import "@patternfly/patternfly/patternfly.css";
import "@patternfly/patternfly/patternfly-addons.css";
import {
    Brand,
    Button,
    ButtonVariant,
    Masthead,
    MastheadBrand,
    MastheadContent,
    MastheadMain,
    MastheadToggle,
    Nav, NavExpandable,
    NavItem,
    NavList,
    Page,
    PageSection,
    PageSectionVariants,
    PageSidebar,
    PageSidebarBody,
    PageToggleButton,
    Text,
    TextContent,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem
} from "@patternfly/react-core";
import BarsIcon from "@patternfly/react-icons/dist/esm/icons/bars-icon";
import QuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/question-circle-icon";
import brandLogo from "/apicurio_primary_logo_white.svg";
import { ALL_DEMOS, Demo } from "./AllDemos.tsx";

function App() {
    const [activeDemo, setActiveDemo] = useState(ALL_DEMOS["Editors"][0]);

    const headerToolbar = (
        <Toolbar id="toolbar" isFullHeight isStatic>
            <ToolbarContent>
                <ToolbarGroup
                    variant="icon-button-group"
                    align={{ default: "alignRight" }}
                    spacer={{ default: "spacerNone", md: "spacerMd" }}
                >
                    <ToolbarGroup variant="icon-button-group" visibility={{ default: "hidden", lg: "visible" }}>
                        <ToolbarItem>
                            <Button aria-label="Help" variant={ButtonVariant.plain} icon={<QuestionCircleIcon />} />
                        </ToolbarItem>
                    </ToolbarGroup>
                </ToolbarGroup>
            </ToolbarContent>
        </Toolbar>
    );

    const masthead = (
        <Masthead>
            <MastheadToggle>
                <PageToggleButton variant="plain" aria-label="Global navigation">
                    <BarsIcon />
                </PageToggleButton>
            </MastheadToggle>
            <MastheadMain>
                <MastheadBrand>
                    <Brand src={brandLogo} alt="PatternFly" heights={{ default: "36px" }} />
                </MastheadBrand>
                <div style={{ fontSize: "20px", marginLeft: "10px", marginBottom: "-5px" }}>Editor Components</div>
            </MastheadMain>
            <MastheadContent>{headerToolbar}</MastheadContent>
        </Masthead>
    );

    const renderDemos = (demos: Demo[]): React.ReactNode => {
        return demos.map((demo, idx) =>
            <NavItem
                key={idx}
                itemId={idx}
                isActive={demo === activeDemo}
                to={`#${demo.name}`}
                onClick={() => { setActiveDemo(demo); }}
            >
                { demo.name }
            </NavItem>
        );
    };

    const renderDemoGroups = (): React.ReactNode => {
        return Object.getOwnPropertyNames(ALL_DEMOS).map((group, idx) => {
            return (
                <NavExpandable
                    title={group}
                    key={idx}
                    groupId={`nav-expandable-group-${idx}`}
                    isExpanded
                >
                    {
                        renderDemos(ALL_DEMOS[group])
                    }
                </NavExpandable>
            );
        });
    };

    const pageNav = (
        <Nav>
            <NavList>
                {
                    renderDemoGroups()
                }
            </NavList>
        </Nav>
    );

    const sidebar = (
        <PageSidebar>
            <PageSidebarBody>{pageNav}</PageSidebarBody>
        </PageSidebar>
    );

    const mainContainerId = "main-content";

    return (
        <Page
            header={masthead}
            sidebar={sidebar}
            isManagedSidebar
            mainContainerId={mainContainerId}
            additionalGroupedContent={
                <PageSection variant={PageSectionVariants.light} isWidthLimited>
                    <TextContent>
                        <Text component="h1">{activeDemo.name}</Text>
                        <Text component="p">{activeDemo.description}</Text>
                    </TextContent>
                </PageSection>
            }
        >
            <PageSection children={activeDemo.component} />
        </Page>
    );
}

export default App;
