import type { ExternalLink as ExternalLinkData } from '@portfolio/data/domain/types';
import type { IconName } from '../../primitives/icon';

const LINK_PURPOSE_ICONS: Record<string, IconName> = {
  'official-source': 'globe',
  reading: 'book-open',
  viewing: 'play-circle',
  purchase: 'shopping-cart',
  download: 'download',
  documentation: 'book-open',
  repository: 'folder-git',
  demo: 'play-circle',
  translation: 'languages',
  'archived-version': 'archive',
  review: 'star',
  discussion: 'messages-square',
  'author-page': 'user',
  'publisher-page': 'building',
  other: 'more-horizontal',
};

export function linkIcon(link: ExternalLinkData): IconName {
  if (/\.pdf($|[?#])/i.test(link.url)) {
    return 'document';
  }
  return (link.purpose && LINK_PURPOSE_ICONS[link.purpose]) || 'external';
}
