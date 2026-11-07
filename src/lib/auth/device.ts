/** "Mozilla/5.0 (Windows NT 10.0…) Chrome/…" → "Chrome on Windows" */
export function describeDevice(userAgent: string) {
  const browser =
    [
      [/Edg\//, "Edge"],
      [/OPR\/|Opera/, "Opera"],
      [/Firefox\//, "Firefox"],
      [/Chrome\//, "Chrome"],
      [/Safari\//, "Safari"],
    ].find(([pattern]) => (pattern as RegExp).test(userAgent))?.[1] ?? "Unknown browser";
  const system =
    [
      [/iPhone|iPad/, "iOS"],
      [/Android/, "Android"],
      [/Windows/, "Windows"],
      [/Mac OS X|Macintosh/, "macOS"],
      [/Linux/, "Linux"],
    ].find(([pattern]) => (pattern as RegExp).test(userAgent))?.[1];
  return system ? `${browser} on ${system}` : String(browser);
}
