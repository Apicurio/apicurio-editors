import {
  Button,
  Label,
  LabelGroup,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  TreeView,
  TreeViewDataItem,
  TreeViewSearch,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { DocumentPath } from "../OpenApiEditorModels.ts";
import { useState } from "react";
import { ArrowRightIcon } from "@patternfly/react-icons";
import { useMachineSelector } from "./DocumentDesignerMachineContext.ts";

export function Paths() {
  const { paths } = useMachineSelector(({ context }) => {
    return {
      paths: context.paths,
    };
  });
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const options = buildTree(paths, ({ node: { path, nodePath } }) => {
    actorRef.send({ type: "SELECT_PATH_VISUALIZER", path, nodePath });
  });

  const [filteredItems, setFilteredItems] = useState(options);
  const [isFiltered, setIsFiltered] = useState(false);

  const filterItems = (
    item: TreeViewDataItem,
    input: string | undefined
  ): boolean => {
    if (
      typeof item.title === "string" &&
      item.title.toLowerCase().includes((input ?? "").toLowerCase())
    ) {
      return true;
    }
    if (item.children) {
      return (
        (item.children = item.children
          .map((opt) => Object.assign({}, opt))
          .filter((child) => filterItems(child, input))).length > 0
      );
    }
    return false;
  };

  console.log({ paths, options });

  if (paths.length === 0) return null;

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    if (input === "") {
      setFilteredItems(options);
      setIsFiltered(false);
    } else {
      const filtered = options
        .map((opt) => Object.assign({}, opt))
        .filter((item) => filterItems(item, input));
      setFilteredItems(filtered);
      setIsFiltered(true);
    }
  };

  const toolbar = (
    <Toolbar style={{ padding: 0 }}>
      <ToolbarContent style={{ padding: 0 }}>
        <ToolbarItem>
          <TreeViewSearch
            onSearch={onSearch}
            id="input-search"
            name="search-input"
            aria-label="Search input example"
          />
        </ToolbarItem>
        <ToolbarItem alignSelf={"center"}>
          <Button variant={"link"} onClick={() => setIsFiltered(true)}>
            Expand all
          </Button>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );

  return (
    <TreeView
      aria-label="Tree View with memoization example"
      data={filteredItems}
      allExpanded={isFiltered}
      toolbar={toolbar}
      hasGuides={true}
      hasBadges={true}
      useMemo
    />
  );
}

function buildTree(
  elements: DocumentPath[],
  onClick: (path: DocumentPath) => void
): TreeViewDataItem[] {
  const root: TreeViewDataItem[] = [];

  elements.forEach((element) => {
    const parts = element.node.path.split("/").filter(Boolean); // Split and remove empty strings
    let currentLevel = root;

    parts.forEach((part, index) => {
      let existingNode = currentLevel.find((node) => node.title === part);

      if (!existingNode) {
        existingNode = {
          name: (
            <>
              {part}&nbsp;
              <LabelGroup>
                {element.operations.get && (
                  <Label color={"green"} isCompact={true}>
                    Get
                  </Label>
                )}
                {element.operations.put && (
                  <Label color={"teal"} isCompact={true}>
                    Put
                  </Label>
                )}
                {element.operations.post && (
                  <Label color={"orange"} isCompact={true}>
                    Post
                  </Label>
                )}
                {element.operations.delete && (
                  <Label color={"red"} isCompact={true}>
                    Delete
                  </Label>
                )}
                {element.operations.head && (
                  <Label color={"purple"} isCompact={true}>
                    Head
                  </Label>
                )}
                {element.operations.patch && (
                  <Label color={"purple"} isCompact={true}>
                    Patch
                  </Label>
                )}
                {element.operations.trace && (
                  <Label color={"purple"} isCompact={true}>
                    Trace
                  </Label>
                )}
              </LabelGroup>
            </>
          ),
          title: part,
          action: (
            <Button
              variant={"plain"}
              aria-label={"Visit path"}
              icon={<ArrowRightIcon />}
              onClick={() => onClick(element)}
            />
          ),
        };
        currentLevel.push(existingNode);
      }

      if (index === parts.length - 1) {
        // Optional: Add additional metadata to the node here if needed
      }

      if (!existingNode.children) {
        existingNode.children = [];
      }

      currentLevel = existingNode.children; // Move deeper into the tree
    });
  });

  // Clean up empty children arrays
  const removeEmptyChildren = (nodes: TreeViewDataItem[]): TreeViewDataItem[] =>
    nodes.map((node) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      } else if (node.children) {
        node.children = removeEmptyChildren(node.children);
        node.name = node.title;
      }
      return node;
    });

  return removeEmptyChildren(root);
}
