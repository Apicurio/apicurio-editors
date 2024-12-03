import { Info } from "./Info.tsx";
import { DesignerLayout } from "./DesignerLayout.tsx";
import { Properties } from "./Properties.tsx";

export function Designer({ title }: { title: string }) {
  return (
    <DesignerLayout title={title} info={<Info />} properties={<Properties />} />
  );
}
