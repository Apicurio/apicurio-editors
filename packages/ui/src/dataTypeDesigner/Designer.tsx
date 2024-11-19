import { Info } from "./Info.tsx";
import { DesignerLayout } from "./DesignerLayout.tsx";
import { Properties } from "./Properties.tsx";

export function Designer() {
  return <DesignerLayout info={<Info />} properties={<Properties />} />;
}
