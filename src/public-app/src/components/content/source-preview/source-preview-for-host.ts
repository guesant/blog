import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { genericPreview } from './generic-preview';
import { githubOrGenericPreview } from './github-or-generic-preview';
import { isGithubHost } from './is-github-host';
import { isYoutubeHost } from './is-youtube-host';
import { youtubeOrGenericPreview } from './youtube-or-generic-preview';
import type { SourcePreviewData } from './types';

type SourcePreviewForHostProps = {
  item: Reference;
  link: ExternalLink;
  url: URL;
};

export function sourcePreviewForHost(props: SourcePreviewForHostProps): SourcePreviewData {
  const host = props.url.hostname.toLocaleLowerCase().replace(/^www\./, '');

  if (isGithubHost({ host })) {
    return githubOrGenericPreview(props);
  }

  if (isYoutubeHost({ host })) {
    return youtubeOrGenericPreview(props);
  }

  return genericPreview(props.item, props.link, props.url);
}
