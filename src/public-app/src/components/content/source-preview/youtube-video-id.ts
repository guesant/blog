import type { Reference } from '@portfolio/data/domain/types';
import { nonEmpty } from './source-preview-non-empty';

export function youtubeVideoId(item: Reference, url: URL): string | undefined {
  return nonEmpty(url.searchParams.get('v')) ?? nonEmpty(item.video?.youtubeId);
}
