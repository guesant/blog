type IsGithubHostProps = {
  host: string;
};

export function isGithubHost(props: IsGithubHostProps): boolean {
  return props.host === 'github.com';
}
