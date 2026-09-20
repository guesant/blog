export function joinDefined(parts: (string | undefined)[]) {
  return parts.filter((part) => part && part.length > 0).join(' · ');
}
