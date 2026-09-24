'use client';

import { Box, Typography } from '../../ui';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { ReadCaseLink } from './read-case-link';

type FeaturedCaseFooterProps = { item: CaseStudy };

export function FeaturedCaseFooter(props: FeaturedCaseFooterProps) {
  return (
    <Box visualVariant="featuredCaseFooter">
      <Typography visualVariant="featuredCaseFooter">
        {props.item.technologies.join(' · ')}
      </Typography>
      <ReadCaseLink href={props.item.url ?? `/cases/${props.item.slug}`} />
    </Box>
  );
}
