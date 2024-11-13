import {
  NotificationDrawer,
  NotificationDrawerGroup,
  NotificationDrawerList,
  NotificationDrawerListItem,
  NotificationDrawerListItemBody,
  NotificationDrawerListItemHeader,
  PageSection,
} from "@patternfly/react-core";
import { NodeHeader } from "./NodeHeader.tsx";
import { OpenApiEditorMachineContext } from "../OpenApiEditor.tsx";
import { groupBy } from "lodash";
import { Validation } from "../OpenApiEditorModels.ts";
import { useState } from "react";

export function ValidationMessages() {
  const [isPathsExpanded, setIsPathsExpanded] = useState(true);
  const [isDataTypesExpanded, setIsDataTypesExpanded] = useState(true);
  const [isResponsesExpanded, setIsResponsesExpanded] = useState(true);
  const { path, datatype, response } = OpenApiEditorMachineContext.useSelector(
    ({ context }) => {
      const {
        path = [],
        datatype = [],
        response = [],
      } = groupBy(context.validationProblems, (v) => v.node.type);
      return {
        path,
        datatype,
        response,
      };
    }
  );
  const actorRef = OpenApiEditorMachineContext.useActorRef();

  function validationToNotification(v: Validation, idx: number) {
    const title = (() => {
      switch (v.node.type) {
        case "path":
          return v.node.path;
        case "datatype":
        case "response":
          return v.node.name;
        default:
          return "";
      }
    })();
    return (
      <NotificationDrawerListItem
        variant={v.severity}
        key={`${v.node.type}-${idx}`}
        onClick={() => {
          switch (v.node.type) {
            case "path":
              actorRef.send({
                type: "SELECT_PATH_DESIGNER",
                path: v.node.path,
                nodePath: v.nodePath,
              });
              break;
            case "datatype":
              actorRef.send({
                type: "SELECT_DATA_TYPE_DESIGNER",
                name: v.node.name,
                nodePath: v.nodePath,
              });
              break;
            case "response":
              actorRef.send({
                type: "SELECT_RESPONSE_DESIGNER",
                name: v.node.name,
                nodePath: v.nodePath,
              });
              break;
          }
        }}
      >
        <NotificationDrawerListItemHeader
          variant={v.severity}
          title={title}
          srTitle={`${v.severity} notification:`}
        />
        <NotificationDrawerListItemBody>
          {v.message}
        </NotificationDrawerListItemBody>
      </NotificationDrawerListItem>
    );
  }

  return (
    <>
      <NodeHeader
        title={"Validation problems"}
        isClosable={true}
        view={"no-code"}
      />
      <PageSection>
        <NotificationDrawer>
          <NotificationDrawerGroup
            title="Paths"
            isExpanded={isPathsExpanded}
            count={path.length}
            onExpand={(_, v) => setIsPathsExpanded(v)}
          >
            <NotificationDrawerList
              isHidden={!isPathsExpanded}
              aria-label="Paths validation problems"
            >
              {path.map(validationToNotification)}
            </NotificationDrawerList>
          </NotificationDrawerGroup>
          <NotificationDrawerGroup
            title="Data types"
            isExpanded={isDataTypesExpanded}
            count={datatype.length}
            onExpand={(_, v) => setIsDataTypesExpanded(v)}
          >
            <NotificationDrawerList
              isHidden={!isDataTypesExpanded}
              aria-label="Data types validation problems"
            >
              {datatype.map(validationToNotification)}
            </NotificationDrawerList>
          </NotificationDrawerGroup>
          <NotificationDrawerGroup
            title="Responses"
            isExpanded={isResponsesExpanded}
            count={response.length}
            onExpand={(_, v) => setIsResponsesExpanded(v)}
          >
            <NotificationDrawerList
              isHidden={!isResponsesExpanded}
              aria-label="Responses validation problems"
            >
              {response.map(validationToNotification)}
            </NotificationDrawerList>
          </NotificationDrawerGroup>
        </NotificationDrawer>
      </PageSection>
    </>
  );
}
