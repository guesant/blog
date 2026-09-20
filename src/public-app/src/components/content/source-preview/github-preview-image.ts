import type { GithubPreviewKind } from './resolve-github-preview-kind';

type GithubPreviewImageProps = {
  kind: GithubPreviewKind;
  owner: string;
  name?: string;
};

export function githubPreviewImage(props: GithubPreviewImageProps): string {
  if (props.kind === 'repository') {
    return `https://opengraph.githubassets.com/1/${encodeURIComponent(props.owner)}/${encodeURIComponent(props.name ?? '')}`;
  }

  return `https://github.com/${encodeURIComponent(props.owner)}.png?size=320`;
}
