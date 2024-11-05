import {
  Accordion,
  Badge,
  JumpLinks,
  JumpLinksItem,
  PageSection,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { AccordionSection } from "./AccordionSection.tsx";
import { Contact } from "./Contact.tsx";
import { Info } from "./Info.tsx";
import { License } from "./License.tsx";
import { TagDefinitions } from "./TagDefinitions.tsx";

export function DocumentRoot() {
  const { title, tagsCount } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => ({
      title: context.document.title,
      tagsCount: context.document.tags.length,
    })
  );
  return (
    <>
      <PageSection>
        <JumpLinks scrollableSelector={".document-root"} isCentered={false}>
          <JumpLinksItem href="#info">Info</JumpLinksItem>
          <JumpLinksItem href="#contact">Contact</JumpLinksItem>
          <JumpLinksItem href="#license">License</JumpLinksItem>
          <JumpLinksItem href="#tag-definitions">Tag definitions</JumpLinksItem>
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
            title={
              <Split hasGutter={true}>
                <SplitItem>Tag definitions</SplitItem>
                <SplitItem>
                  <Badge>{tagsCount}</Badge>
                </SplitItem>
              </Split>
            }
            id={"tag-definitions"}
          >
            <TagDefinitions />
          </AccordionSection>
        </Accordion>
      </PageSection>
    </>
  );
}
