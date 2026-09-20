import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { genericPreview } from './generic-preview';
import { githubPreview } from './github-preview';
import type { SourcePreviewData } from './types';

type GithubOrGenericPreviewProps = {
  item: Reference;
  link: ExternalLink;
  url: URL;
};

export function githubOrGenericPreview(props: GithubOrGenericPreviewProps): SourcePreviewData {
  return (
    githubPreview(props.item, props.link, props.url) ??
    genericPreview(props.item, props.link, props.url)
  );
}
