'use client';

import type { ExternalLink as ExternalLinkData } from '@portfolio/data/domain/types';
import { ReferenceLinkContent } from './reference-link-content';
import { ReferenceLinkItemFrame } from '../../ui/semantic/ReferenceLinkItemFrame';

type ReferenceLinkItemProps = {
  link: ExternalLinkData;
  index: number;
  freeLabel: string;
};

export function ReferenceLinkItem(props: ReferenceLinkItemProps) {
  const { link, freeLabel } = props;

  return (
    <ReferenceLinkItemFrame component="li">
      <ReferenceLinkContent link={link} freeLabel={freeLabel} />
    </ReferenceLinkItemFrame>
  );
}
