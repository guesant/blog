export async function copyPassword(value: string, setCopied: (copied: boolean) => void) {
  if (!value) {
    return;
  }
  await navigator.clipboard.writeText(value);
  setCopied(true);
}
