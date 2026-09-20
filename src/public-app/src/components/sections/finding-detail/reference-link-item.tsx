'use client';

import { Box } from '../../ui';
import type { ExternalLink as ExternalLinkData } from '@portfolio/data/domain/types';
import { ReferenceLinkContent } from './reference-link-content';

type ReferenceLinkItemProps = {
  link: ExternalLinkData;
  index: number;
  freeLabel: string;
};

export function ReferenceLinkItem(props: ReferenceLinkItemProps) {
  const { link, freeLabel } = props;

  return (
    <Box component="li" visualVariant="referenceLinkItem">
      <ReferenceLinkContent link={link} freeLabel={freeLabel} />
    </Box>
  );
}
