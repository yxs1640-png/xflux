/**
 * JSON.parse turns integers above Number.MAX_SAFE_INTEGER into rounded floats.
 * X/Twitter snowflake IDs are 64-bit; quoting 16+ digit literals before parse
 * preserves them as strings (Twitter GraphQL already uses string rest_id/id_str).
 */
export function parseJsonPreservingLargeIntegers<T = unknown>(text: string): T {
  const quoted = text.replace(/([:\[,]\s*)(-?\d{16,})(?=\s*[,\]}])/g, '$1"$2"');
  return JSON.parse(quoted) as T;
}
