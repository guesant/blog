type ResolveGithubPreviewKindProps = {
  first?: string;
  second?: string;
  itemType?: string;
};

export type GithubPreviewKind = 'repository' | 'organization' | 'user';

import { githubItemPreviewKind } from './github-item-preview-kind';
import { githubPathPreviewKind } from './github-path-preview-kind';

export function resolveGithubPreviewKind(
  props: ResolveGithubPreviewKindProps,
): GithubPreviewKind | undefined {
  return githubPathPreviewKind(props) ?? githubItemPreviewKind(props);
}
