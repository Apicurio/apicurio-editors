import { Info } from "./Info.tsx";
import { Servers } from "./Servers.tsx";
import { DesignerLayout } from "./DesignerLayout.tsx";

export function Designer() {
  return <DesignerLayout info={<Info />} servers={<Servers />} />;
}
