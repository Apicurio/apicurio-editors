import {
  Button,
  Menu,
  MenuContainer,
  MenuContent,
  MenuItem,
  MenuList,
  MenuToggle,
  Panel,
  PanelMain,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { TimesIcon } from "@patternfly/react-icons";
import { useMemo, useRef, useState } from "react";
import { NavigationPaths } from "./NavigationPaths.tsx";

export function OmniSearch() {
  const [filter, setFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>();
  const textInputRef = useRef<HTMLInputElement>();
  const { view, currentNode, navigation } =
    OpenApiEditorMachineContext.useSelector((state) => ({
      view: state.context.view,
      currentNode: state.context.currentNode,
      navigation: state.context.navigation,
    }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();

  const filtered = filter.length > 0;

  function close() {
    setFilter("");
    setIsOpen(false);
  }

  const placeholder = (() => {
    if (!isOpen) {
      return "Search";
    } else {
      if (filter === "") {
        return "Search path";
      } else {
        return "";
      }
    }
  })();

  const toggle = useMemo(
    () => (
      <MenuToggle
        variant="typeahead"
        isFullWidth
        aria-label="Typeahead menu toggle"
        ref={toggleRef}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        <TextInputGroup isPlain>
          <TextInputGroupMain
            innerRef={textInputRef}
            value={filter}
            onChange={(_, filter) => {
              setFilter(filter);
            }}
            onFocus={() => {
              setIsOpen(true);
            }}
            id="typeahead-select-input"
            autoComplete="off"
            placeholder={placeholder}
          />

          <TextInputGroupUtilities>
            {filtered && (
              <Button
                variant="plain"
                onClick={() => setFilter("")}
                aria-label="Clear input value"
                icon={<TimesIcon aria-hidden />}
              />
            )}
          </TextInputGroupUtilities>
        </TextInputGroup>
      </MenuToggle>
    ),
    [filter, placeholder],
  );

  const menu = useMemo(
    () => (
      <Panel
        ref={menuRef}
        variant="raised"
        style={{
          width: "300px",
        }}
        isScrollable={true}
      >
        <PanelMain tabIndex={0} maxHeight={"50vh"}>
          {filter.length > 0 &&
            (() => {
              switch (filter[0]) {
                case "@":
                  return "TODO Responses";
                case "&":
                  return "TODO Data type";
                case "#":
                  return "TODO tags";
                case ">":
                  return "TODO commands";
                default:
                  return (
                    <NavigationPaths
                      paths={navigation.paths.filter((n) =>
                        n.path.includes(filter),
                      )}
                      filtered={filtered}
                      onClick={(p) => {
                        const type = (() => {
                          switch (view) {
                            case "design":
                              return "SELECT_PATH_DESIGNER";
                            case "code":
                              return "SELECT_PATH_CODE";
                          }
                        })();
                        actorRef.send({
                          type,
                          path: p.path,
                          nodePath: p.nodePath,
                        });
                        close();
                      }}
                      isActive={(p) =>
                        "path" in currentNode && p.path === currentNode?.path
                      }
                    />
                  );
              }
            })()}
          {filter === "" && (
            <Menu>
              <MenuContent>
                <MenuList>
                  <MenuItem icon={<>&gt;</>}>Show and run commands</MenuItem>
                  <MenuItem icon={<>&</>}>Go to data type</MenuItem>
                  <MenuItem icon={<>@</>}>Go to response</MenuItem>
                  <MenuItem icon={<>#</>}>Go to tag</MenuItem>
                </MenuList>
              </MenuContent>
            </Menu>
          )}
        </PanelMain>
      </Panel>
    ),
    [actorRef, filter, filtered, navigation.paths, currentNode, view],
  );

  return (
    <MenuContainer
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          close();
        } else {
          setIsOpen(isOpen);
        }
      }}
      onOpenChangeKeys={["Escape"]}
      menu={menu}
      menuRef={menuRef}
      toggle={toggle}
      toggleRef={toggleRef}
      shouldFocusFirstItemOnOpen={false}
    />
  );
}
