import type { GithubPreviewKind } from './resolve-github-preview-kind';

const githubPathKinds: Record<string, GithubPreviewKind> = {
  orgs: 'organization',
  users: 'user',
};

type GithubPathPreviewKindProps = {
  first?: string;
  second?: string;
};

export function githubPathPreviewKind(
  props: GithubPathPreviewKindProps,
): GithubPreviewKind | undefined {
  return props.first && props.second ? githubPathKinds[props.first] : undefined;
}
