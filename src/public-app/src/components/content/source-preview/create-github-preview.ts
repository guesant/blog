import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { githubPreviewIcon } from './github-preview-icon';
import { githubPreviewFallbackTitle } from './github-preview-fallback-title';
import { sourcePreviewFirstText } from './source-preview-first-text';
import type { GithubPreviewKind } from './resolve-github-preview-kind';
import type { SourcePreviewData } from './types';

type CreateGithubPreviewProps = {
  item: Reference;
  link: ExternalLink;
  kind: GithubPreviewKind;
  owner: string;
  name?: string;
};

export function createGithubPreview(props: CreateGithubPreviewProps): SourcePreviewData {
  const fallbackTitle = githubPreviewFallbackTitle(props);

  return {
    provider: 'github',
    kind: props.kind,
    url: props.link.url,
    title: fallbackTitle,
    description: sourcePreviewFirstText([props.item.description]),
    icon: githubPreviewIcon(props.kind),
    metadata: [],
    filterType: props.item.type,
  };
}
