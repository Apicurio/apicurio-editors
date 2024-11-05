import {
  Accordion,
  JumpLinks,
  JumpLinksItem,
  PageSection,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { AccordionSection } from "./AccordionSection.tsx";
import { Contact } from "./Contact.tsx";
import { Info } from "./Info.tsx";
import { License } from "./License.tsx";
import { TagDefinitions } from "./TagDefinitions.tsx";

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
        <Accordion asDefinitionList={false} displaySize={"lg"}>
          <AccordionSection title={"Info"} id={"info"}>
            <Info />
          </AccordionSection>
          <AccordionSection title={"Contact"} id={"contact"}>
            <Contact />
          </AccordionSection>
          <AccordionSection title={"License"} id={"license"}>
            <License />
          </AccordionSection>
          <AccordionSection
            title={"Tag definitions"}
            count={tagsCount}
            id={"tag-definitions"}
          >
            <TagDefinitions />
          </AccordionSection>
          <AccordionSection
            title={"Servers"}
            count={serversCount}
            id={"servers"}
          >
            TODO
          </AccordionSection>
          <AccordionSection
            title={"Security scheme"}
            count={securitySchemeCount}
            id={"security-scheme"}
          >
            TODO
          </AccordionSection>
          <AccordionSection
            title={"Security requirements"}
            count={securityRequirementsCount}
            id={"security-requirements"}
          >
            TODO
          </AccordionSection>
        </Accordion>
      </PageSection>
    </>
  );
}
