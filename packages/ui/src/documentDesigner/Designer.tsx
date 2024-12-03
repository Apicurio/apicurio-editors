import { Overview } from "./Overview.tsx";
import { Contact } from "./Contact.tsx";
import { License } from "./License.tsx";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function Designer() {
  return (
    <DesignerLayout
      overview={<Overview />}
      contact={<Contact />}
      license={<License />}
    />
  );
}
