/** Deep-merge message objects; `override` wins on leaf conflicts. */
export function deepMergeMessages<T extends Record<string, unknown>>(
  base: T,
  override: Record<string, unknown>
): T {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const prev = out[key];
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      prev &&
      typeof prev === "object" &&
      !Array.isArray(prev)
    ) {
      out[key] = deepMergeMessages(
        prev as Record<string, unknown>,
        value as Record<string, unknown>
      );
    } else {
      out[key] = value;
    }
  }
  return out as T;
}
