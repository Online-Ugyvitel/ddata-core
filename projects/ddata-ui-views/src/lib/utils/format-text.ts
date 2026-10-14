/**
 * Replaces the `{name}` placeholders of an overridable text, e.g. `'{casefile} moved to {status}'`.
 */
export function formatText(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in values ? String(values[name]) : placeholder
  );
}
