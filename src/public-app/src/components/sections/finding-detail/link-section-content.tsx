'use client';

import type { Reference } from '@portfolio/data/domain/types';
import { Box } from '../../ui';
import { LinkList } from './link-list';
import { SourcePreview } from './source-preview/source-preview';
import { sourcePreviewDataForLink } from '../../content/source-preview/source-preview-data-for-link';
import type { AchadosTranslator } from '@/i18n/compat-support';

type LinkSectionContentProps = { item: Reference; t: AchadosTranslator };

export function LinkSectionContent(props: LinkSectionContentProps) {
  const entries = props.item.links.map((link) => ({
    link,
    data: sourcePreviewDataForLink(props.item, link),
  }));

  const previews = entries.filter(
    (entry): entry is { link: Reference['links'][number]; data: NonNullable<typeof entry.data> } =>
      entry.data !== undefined,
  );

  const fallbackLinks = entries
    .filter((entry) => entry.data === undefined)
    .map((entry) => entry.link);

  if (previews.length === 0) {
    return <LinkList item={props.item} t={props.t} />;
  }

  return (
    <Box visualVariant="linkSectionContent">
      {previews.map((entry) => (
        <SourcePreview key={entry.link.url} data={entry.data} t={props.t} />
      ))}
      {fallbackLinks.length > 0 && (
        <LinkList item={{ ...props.item, links: fallbackLinks }} t={props.t} />
      )}
    </Box>
  );
}
