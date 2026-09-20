import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { githubPreviewIcon } from './github-preview-icon';
import { githubPreviewImage } from './github-preview-image';
import { githubPreviewMetadata } from './github-preview-metadata';
import { githubPreviewFallbackTitle } from './github-preview-fallback-title';
import { nonEmpty } from './source-preview-non-empty';
import { sourcePreviewFirstValue } from './source-preview-first-value';
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
  const metadataEntries = githubPreviewMetadata(props);

  const fallbackTitle = githubPreviewFallbackTitle(props);

  const imageFallback = githubPreviewImage(props);

  return {
    provider: 'github',
    kind: props.kind,
    url: props.link.url,
    title: sourcePreviewFirstText([nonEmpty(props.link.openGraph?.title), fallbackTitle]),
    description: sourcePreviewFirstText([
      nonEmpty(props.link.openGraph?.description),
      props.item.description,
    ]),
    imageUrl: sourcePreviewFirstValue([nonEmpty(props.link.openGraph?.image), imageFallback]),
    icon: githubPreviewIcon(props.kind),
    metadata: metadataEntries,
    filterType: props.item.type,
  };
}
