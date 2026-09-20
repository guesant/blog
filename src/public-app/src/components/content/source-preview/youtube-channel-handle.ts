export function youtubeChannelHandle(value: string | undefined): string | undefined {
  return value?.startsWith('@') ? value : undefined;
}
