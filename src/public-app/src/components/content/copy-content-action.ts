export async function copyContentAction(
  setCopied: (kind: string) => void,
  value: string,
  kind: string,
) {
  await navigator.clipboard.writeText(value);
  setCopied(kind);
  window.setTimeout(() => setCopied(''), 1600);
}
