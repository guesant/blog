type IsYoutubeHostProps = {
  host: string;
};

export function isYoutubeHost(props: IsYoutubeHostProps): boolean {
  return ['youtube.com', 'm.youtube.com', 'youtu.be'].includes(props.host);
}
