import {
  Breadcrumb,
  BreadcrumbItem,
  Label,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { CodeIcon, ReplyAllIcon, RouteIcon } from "@patternfly/react-icons";
import { OpenApiEditorMachineContext } from "../OpenApiEditor";

export function Header() {
  const { title, selectedNode } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => ({
      title: context.document.title,
      selectedNode: context.selectedNode,
    })
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <Breadcrumb ouiaId="editor-breadcrumbs">
      <BreadcrumbItem component={"button"}>
        <img
          src={
            "data:image/png;base64,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"
          }
        />
      </BreadcrumbItem>
      <BreadcrumbItem
        component={"button"}
        isActive={false}
        onClick={() => {
          actorRef.send({ type: "DESELECT_NODE" });
        }}
      >
        {title}
      </BreadcrumbItem>
      {selectedNode && (
        <BreadcrumbItem component={"button"} isActive={true}>
          <Split hasGutter={true}>
            <SplitItem> {selectedNode.path}</SplitItem>
            <SplitItem>
              {(() => {
                switch (selectedNode.type) {
                  case "path":
                    return (
                      <Label isCompact={true} icon={<RouteIcon />}>
                        Path
                      </Label>
                    );
                  case "datatype":
                    return (
                      <Label isCompact={true} icon={<CodeIcon />}>
                        Data type
                      </Label>
                    );
                  case "response":
                    return (
                      <Label isCompact={true} icon={<ReplyAllIcon />}>
                        Response
                      </Label>
                    );
                }
              })()}
            </SplitItem>
          </Split>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
}
