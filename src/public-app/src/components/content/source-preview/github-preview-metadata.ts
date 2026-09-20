import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import type { GithubPreviewKind } from './resolve-github-preview-kind';
import type { SourcePreviewMetadata } from './types';
import { githubRepositoryMetadata } from './github-repository-metadata';
import { metadata } from './source-preview-metadata';

type GithubPreviewMetadataProps = {
  item: Reference;
  link: ExternalLink;
  kind: GithubPreviewKind;
  owner: string;
};

export function githubPreviewMetadata(props: GithubPreviewMetadataProps): SourcePreviewMetadata[] {
  return [
    metadata('owner', props.owner),
    ...githubRepositoryMetadata(props),
    metadata('siteName', props.link.openGraph?.siteName),
    metadata('contentType', props.link.openGraph?.type),
  ].filter((entry): entry is SourcePreviewMetadata => entry !== undefined);
}
