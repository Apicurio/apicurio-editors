import { Label } from "@patternfly/react-core";
import { TagIcon } from "@patternfly/react-icons";

function createSafeAnchor(input: string): string {
  // Remove leading/trailing whitespace
  let safeAnchor = input.trim();

  // Replace spaces and unsafe characters with hyphens
  safeAnchor = safeAnchor.replace(/[^a-zA-Z0-9-_]+/g, "-");

  // Convert to lowercase for consistency
  safeAnchor = safeAnchor.toLowerCase();

  // Remove any duplicate hyphens
  safeAnchor = safeAnchor.replace(/-+/g, "-");

  // Trim any trailing hyphen
  safeAnchor = safeAnchor.replace(/-$/, "");

  return safeAnchor;
}

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
