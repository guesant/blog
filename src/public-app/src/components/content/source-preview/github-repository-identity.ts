type GithubRepositoryIdentityProps = {
  repositoryOwner?: string;
  repositoryName?: string;
  first?: string;
  second?: string;
};

export function githubRepositoryIdentity(props: GithubRepositoryIdentityProps) {
  return {
    owner: props.repositoryOwner ?? props.first,
    name: props.repositoryName ?? props.second,
  };
}
