import { Label } from "@patternfly/react-core";
import { TagIcon } from "@patternfly/react-icons";
import { createSafeAnchor } from "../utils/createSafeAnchor.ts";

export function getTagId(name: string) {
  return `tag-${createSafeAnchor(name)}`;
}

export function TagLabel({ name }: { name: string }) {
  const id = getTagId(name);
  return (
    <Label icon={<TagIcon />} href={`#${id}`}>
      {name}
    </Label>
  );
}
