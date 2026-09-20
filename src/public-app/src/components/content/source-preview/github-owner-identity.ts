type GithubOwnerIdentityProps = {
  first?: string;
  second?: string;
};

export function githubOwnerIdentity(props: GithubOwnerIdentityProps) {
  return { owner: props.second ?? props.first };
}
