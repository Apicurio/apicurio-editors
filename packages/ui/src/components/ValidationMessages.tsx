import {
  NotificationDrawer,
  NotificationDrawerList,
  NotificationDrawerListItem,
  NotificationDrawerListItemBody,
  NotificationDrawerListItemHeader,
} from "@patternfly/react-core";

export function ValidationMessages() {
  return (
    <NotificationDrawer>
      <NotificationDrawerList aria-label="Notifications in the basic example">
        <NotificationDrawerListItem variant="info">
          <NotificationDrawerListItemHeader
            variant="info"
            title="Unread info notification title"
            srTitle="Info notification:"
          />
          <NotificationDrawerListItemBody timestamp="5 minutes ago">
            This is an info notification description.
          </NotificationDrawerListItemBody>
        </NotificationDrawerListItem>
      </NotificationDrawerList>
    </NotificationDrawer>
  );
}
