import {
  Grid,
  JumpLinks,
  JumpLinksItem,
  PageSection,
  Title,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Contact } from "./Contact.tsx";
import { Info } from "./Info.tsx";
import { License } from "./License.tsx";
import { TagDefinitions } from "./TagDefinitions.tsx";
import { CardExpandable } from "./CardExpandable.tsx";
import { InlineEdit } from "./InlineEdit.tsx";
import { EditorToolbar } from "./EditorToolbar.tsx";

export function DocumentRoot() {
  const {
    title,
    tagsCount,
    serversCount,
    securitySchemeCount,
    securityRequirementsCount,
  } = OpenApiEditorMachineContext.useSelector(({ context }) => ({
    title: context.document.title,
    tagsCount: context.document.tags?.length,
    serversCount: context.document.servers?.length,
    securitySchemeCount: context.document.securityScheme?.length,
    securityRequirementsCount: context.document.securityRequirements?.length,
  }));
  const actorRef = OpenApiEditorMachineContext.useActorRef();
  return (
    <>
      <PageSection
        stickyOnBreakpoint={{ default: "top" }}
        className={"pf-v6-u-pt-sm"}
      >
        <EditorToolbar />
        <JumpLinks
          scrollableSelector={".apicurio-editor .pf-v6-c-drawer__panel-main"}
          isCentered={false}
          label={
            <Title headingLevel={"h1"}>
              <InlineEdit
                onChange={(title) => {
                  actorRef.send({ type: "CHANGE_TITLE", title });
                }}
                value={title}
                validator={(value) => {
                  if (!value || value.length === 0) {
                    return {
                      status: "error",
                      errMessages: ["Title can't be empty"],
                    };
                  }
                  return { status: "default", errMessages: [] };
                }}
              />
            </Title>
          }
          offset={130}
        >
          <JumpLinksItem href="#info">Info</JumpLinksItem>
          <JumpLinksItem href="#contact">Contact</JumpLinksItem>
          <JumpLinksItem href="#license">License</JumpLinksItem>
          <JumpLinksItem href="#tag-definitions">Tag definitions</JumpLinksItem>
          <JumpLinksItem href="#servers">Servers</JumpLinksItem>
          <JumpLinksItem href="#security-scheme">Security scheme</JumpLinksItem>
          <JumpLinksItem href="#security-requirements">
            Security requirements
          </JumpLinksItem>
        </JumpLinks>
      </PageSection>
      <PageSection aria-label={"Document details"}>
        <Grid hasGutter={true}>
          <CardExpandable title={"Info"} id={"info"}>
            <Info />
          </CardExpandable>
          <CardExpandable title={"Contact"} id={"contact"}>
            <Contact />
          </CardExpandable>
          <CardExpandable title={"License"} id={"license"}>
            <License />
          </CardExpandable>
          <CardExpandable
            title={"Tag definitions"}
            count={tagsCount}
            id={"tag-definitions"}
          >
            <TagDefinitions />
          </CardExpandable>
          <CardExpandable title={"Servers"} count={serversCount} id={"servers"}>
            TODO
          </CardExpandable>
          <CardExpandable
            title={"Security scheme"}
            count={securitySchemeCount}
            id={"security-scheme"}
          >
            TODO
          </CardExpandable>
          <CardExpandable
            title={"Security requirements"}
            count={securityRequirementsCount}
            id={"security-requirements"}
          >
            TODO
          </CardExpandable>
        </Grid>
      </PageSection>
    </>
  );
}
