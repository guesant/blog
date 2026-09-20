import { Box, Typography } from '../ui';
import type { SectionHeadingProps } from './section-heading.types';
import { SectionHeadingGrid } from './section-heading-grid';

type SectionHeadingContentProps = SectionHeadingProps;

export function SectionHeadingContent(props: SectionHeadingContentProps) {
  const { eyebrow } = props;

  return (
    <Box visualVariant="sectionHeadingContent">
      <Typography variant="overline" color="text.secondary" visualVariant="sectionHeadingContent">
        {eyebrow}
      </Typography>
      <SectionHeadingGrid {...props} />
    </Box>
  );
}
