import {
  Button,
  Label,
  LabelGroup,
  Split,
  TreeView,
  TreeViewDataItem,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../../OpenApiEditor.tsx";
import { Path } from "../../OpenApiEditorModels.ts";
import {
  AddCircleOIcon,
  ArrowUpIcon,
  PencilAltIcon,
  TrashIcon,
} from "@patternfly/react-icons";
import { InlineEdit } from "../../components/InlineEdit.tsx";
import { useOpenApiEditorMachinePathsSelector } from "../../useOpenApiEditorMachine.ts";

export function PathsTree() {
  const { paths, isFiltered, filter } = useOpenApiEditorMachinePathsSelector(
    ({ context }) => {
      return {
        paths: context.paths,
        isFiltered: context.filter !== "",
        filter: context.filter,
      };
    },
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  const options = buildTree(paths, ({ node: { path, nodePath } }) => {
    actorRef.send({ type: "SELECT_PATH_DESIGNER", path, nodePath });
  });

  const filterItems = (
    item: ExtendedTreeViewDataItem,
    input: string | undefined,
  ): boolean => {
    if (
      item.titleAsString.toLowerCase().includes((input ?? "").toLowerCase())
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

  if (paths.length === 0) return null;

  const filteredItems =
    filter !== ""
      ? options
          .map((opt) => Object.assign({}, opt))
          .filter((item) => filterItems(item, filter))
      : options;

  return (
    <TreeView
      aria-label="Tree View with memoization example"
      data={filteredItems}
      allExpanded={isFiltered}
      hasGuides={true}
      useMemo
    />
  );
}

type ExtendedTreeViewDataItem = {
  titleAsString: string;
  children?: ExtendedTreeViewDataItem[];
} & TreeViewDataItem;

function buildTree(
  elements: Path[],
  onClick: (path: Path) => void,
): ExtendedTreeViewDataItem[] {
  const root: ExtendedTreeViewDataItem[] = [];

  elements.forEach((element) => {
    const parts = element.node.path.split("/").filter(Boolean); // Split and remove empty strings
    let currentLevel = root;
    let isRoot = true;

    parts.forEach((part, index) => {
      let existingNode = currentLevel.find(
        (node) => node.titleAsString === part,
      );

      if (!existingNode) {
        existingNode = {
          name: (
            <Split hasGutter={true}>
              <InlineEdit value={part} editing={true} />
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
              <Button
                variant={"control"}
                icon={<PencilAltIcon />}
                aria-label={"Edit this path"}
                onClick={() => onClick(element)}
              />
            </Split>
          ),
          title: <InlineEdit value={part} editing={true} />,
          titleAsString: part,
          action: (
            <>
              {!isRoot && (
                <Button
                  variant={"plain"}
                  aria-label={"Move up"}
                  icon={<ArrowUpIcon />}
                />
              )}
              <Button
                variant={"plain"}
                aria-label={"Add a child path"}
                icon={<AddCircleOIcon />}
              />
              <Button
                variant={"plain"}
                aria-label={"Delete path"}
                icon={<TrashIcon />}
              />
            </>
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

      isRoot = false;
      currentLevel = existingNode.children; // Move deeper into the tree
    });
  });

  // Clean up empty children arrays
  const removeEmptyChildren = (
    nodes: ExtendedTreeViewDataItem[],
  ): ExtendedTreeViewDataItem[] =>
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
