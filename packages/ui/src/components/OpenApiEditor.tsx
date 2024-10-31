import {
  Drawer,
  DrawerContent,
  PageSection,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { DocumentTitle, DocumentTitleProps } from "./DocumentTitle.tsx";
import { EditorSidebar, EditorSidebarProps } from "./EditorSidebar.tsx";

type OpenApiEditorProps = {} & EditorSidebarProps & DocumentTitleProps;

export function OpenApiEditor({
  getDocumentTitle,
  editDocumentTitle,
  getPaths,
}: OpenApiEditorProps) {
  return (
    <PageSection
      isFilled={true}
      padding={{ default: "noPadding" }}
      className={"pf-v5-u-h-100"}
    >
      <Stack className={"pf-v5-u-h-100"}>
        <StackItem>
          <DocumentTitle
            getDocumentTitle={getDocumentTitle}
            editDocumentTitle={editDocumentTitle}
          />
        </StackItem>
        <StackItem isFilled={true} style={{ overflow: "auto" }}>
          <Drawer isExpanded={true} isInline={true} position={"start"}>
            <DrawerContent panelContent={<EditorSidebar getPaths={getPaths} />}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
              aliquid amet aperiam assumenda consequatur doloremque eos esse,
              facere itaque, odio officiis quos repudiandae sapiente. A
              asperiores enim nulla praesentium rerum.
            </DrawerContent>
          </Drawer>
        </StackItem>
      </Stack>
    </PageSection>
  );
}
