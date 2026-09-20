import type { GithubPreviewKind } from './resolve-github-preview-kind';
import { githubOwnerIdentity } from './github-owner-identity';
import { githubRepositoryIdentity } from './github-repository-identity';

type GithubPreviewIdentityProps = {
  kind: GithubPreviewKind;
  repositoryOwner?: string;
  repositoryName?: string;
  first?: string;
  second?: string;
};

export type GithubPreviewIdentity = {
  owner?: string;
  name?: string;
};

export function githubPreviewIdentity(props: GithubPreviewIdentityProps): GithubPreviewIdentity {
  if (props.kind === 'repository') {
    return githubRepositoryIdentity(props);
  }
  return githubOwnerIdentity(props);
}
