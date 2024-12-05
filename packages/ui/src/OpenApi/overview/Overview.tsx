import { useOpenApiEditorMachineOverviewSelector } from "../../useOpenApiEditorMachine.ts";
import { OverviewLayout } from "./OverviewLayout.tsx";
import { Information } from "./Information.tsx";
import { Contact } from "./Contact.tsx";
import { License } from "./License.tsx";

export function Overview() {
  const isLoading = useOpenApiEditorMachineOverviewSelector(
    (state) => state.value === "loading",
  );

  switch (isLoading) {
    case true:
      return <OverviewLayout />;
    case false:
      return (
        <OverviewLayout
          information={<Information />}
          contact={<Contact />}
          license={<License />}
        />
      );
  }
}
