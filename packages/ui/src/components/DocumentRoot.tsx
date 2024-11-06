import {
  Grid,
  JumpLinks,
  JumpLinksItem,
  PageSection,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { Contact } from "./Contact.tsx";
import { Info } from "./Info.tsx";
import { License } from "./License.tsx";
import { TagDefinitions } from "./TagDefinitions.tsx";
import { CardExpandable } from "./CardExpandable.tsx";

export function DocumentRoot() {
  const {
    tagsCount,
    serversCount,
    securitySchemeCount,
    securityRequirementsCount,
  } = OpenApiEditorMachineContext.useSelector(({ context }) => ({
    tagsCount: context.document.tags?.length,
    serversCount: context.document.servers?.length,
    securitySchemeCount: context.document.securityScheme?.length,
    securityRequirementsCount: context.document.securityRequirements?.length,
  }));
  return (
    <>
      <PageSection>
        <JumpLinks scrollableSelector={".document-root"} isCentered={false}>
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
      <PageSection
        hasOverflowScroll={true}
        aria-label={"Document details"}
        className={"document-root"}
      >
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
