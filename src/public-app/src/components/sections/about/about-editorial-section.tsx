import { Box, Typography } from '../../ui';
import { ContentRichText } from '../../content/content-rich-text';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { AboutEditorialSectionProps } from './types';

export function AboutEditorialSection(props: AboutEditorialSectionProps) {
  return (
    <Box visualVariant="aboutEditorialSection">
      <ConditionalContent
        condition={Boolean(props.section.title)}
        content={
          <Typography variant="h2" visualVariant="aboutEditorialSectionTitle">
            {props.section.title}
          </Typography>
        }
      />
      <ContentRichText content={props.section.body} />
    </Box>
  );
}
