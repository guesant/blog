import type { CaseLinkProps } from './types';

const variants = {
  compact: {
    card: 'caseLinkCardCompact',
    title: 'caseLinkTitleCompact',
  },
  full: {
    card: 'caseLinkCardFull',
    title: 'caseLinkTitleFull',
  },
} as const;

export function caseLinkVisuals(props: CaseLinkProps) {
  const item = props.item;

  const size = (
    {
      true: 'compact',
      false: 'full',
    } as const
  )[String(Boolean(props.compact)) as 'true' | 'false'];

  return {
    href: item.url ?? `/cases/${item.slug}`,
    status: item.status ?? item.meta,
    cardVariant: variants[size].card,
    titleVariant: variants[size].title,
  } as const;
}
