import type { CaseLinkProps } from './types';

export function caseLinkVisuals(props: CaseLinkProps) {
  const item = props.item;

  return {
    href: item.url ?? `/cases/${item.slug}`,
    status: item.status ?? item.meta,
  } as const;
}
