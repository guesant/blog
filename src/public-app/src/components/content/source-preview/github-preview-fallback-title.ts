import type { GithubPreviewKind } from './resolve-github-preview-kind';

type GithubPreviewFallbackTitleProps = {
  kind: GithubPreviewKind;
  owner: string;
  name?: string;
};

export function githubPreviewFallbackTitle(props: GithubPreviewFallbackTitleProps): string {
  if (props.kind === 'repository' && props.name) {
    return `${props.owner}/${props.name}`;
  }

  return `@${props.owner}`;
}
