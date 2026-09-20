import type { Reference } from '@portfolio/data/domain/types';
import { metadata } from './source-preview-metadata';
import type { GithubPreviewKind } from './resolve-github-preview-kind';
import type { SourcePreviewMetadata } from './types';

type GithubRepositoryMetadataProps = {
  item: Reference;
  kind: GithubPreviewKind;
};

export function githubRepositoryMetadata(
  props: GithubRepositoryMetadataProps,
): SourcePreviewMetadata[] {
  return (
    props.kind === 'repository'
      ? [
          metadata('language', props.item.repo?.language),
          metadata('license', props.item.repo?.license),
        ]
      : []
  ).filter((entry): entry is SourcePreviewMetadata => entry !== undefined);
}
