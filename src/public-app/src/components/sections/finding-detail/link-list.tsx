'use client';

import type { Reference } from '@portfolio/data/domain/types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { ReferenceLinkItem } from './reference-link-item';
import { LinkListFrame } from '../../ui/semantic/LinkListFrame';

type LinkListProps = { item: Reference; t: AchadosTranslator };

export function LinkList(props: LinkListProps) {
  const { item, t } = props;

  return (
    <LinkListFrame component="ul">
      {item.links.map((link, index) => (
        <ReferenceLinkItem
          key={`${link.url}-${index}`}
          link={link}
          index={index}
          freeLabel={t('free')}
        />
      ))}
    </LinkListFrame>
  );
}
