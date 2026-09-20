'use client';

import { Box } from '../../ui';
import { BrandGlyph } from '../../primitives/brand-glyph';
import type { TechnologyChipProps } from './types';

export function TechnologyChip(props: TechnologyChipProps) {
  const { technology } = props;

  return (
    <Box component="li" data-cursor-interactive visualVariant="technologyChip">
      <BrandGlyph label={technology.name} logo={technology.logo} size={16} />
      {technology.name}
    </Box>
  );
}
