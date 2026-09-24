import { Box, Divider } from '../../ui';
import { ContentRichText } from '../../content/content-rich-text';
import type { AboutIntroductionProps } from './types';

export function AboutIntroduction(props: AboutIntroductionProps) {
  return (
    <Box visualVariant="aboutEditorialIntroduction">
      <ContentRichText content={props.content} />
      <Divider visualVariant="aboutSectionDivider" />
    </Box>
  );
}
