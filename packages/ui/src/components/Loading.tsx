import { EmptyState, Spinner } from "@patternfly/react-core";

export function Loading() {
  return <EmptyState icon={Spinner} titleText="Loading" />;
}
