export function createSafeAnchor(input: string): string {
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
