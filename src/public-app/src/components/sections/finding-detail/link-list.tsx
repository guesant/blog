'use client';

import { Box } from '../../ui';
import type { Reference } from '@portfolio/data/domain/types';
import { ReferenceLinkItem } from './reference-link-item';

type LinkListProps = { item: Reference; t: (key: string) => string };

export function LinkList(props: LinkListProps) {
  const { item, t } = props;

  return (
    <Box component="ul" visualVariant="linkList">
      {item.links.map((link, index) => (
        <ReferenceLinkItem
          key={`${link.url}-${index}`}
          link={link}
          index={index}
          freeLabel={t('free')}
        />
      ))}
    </Box>
  );
}
