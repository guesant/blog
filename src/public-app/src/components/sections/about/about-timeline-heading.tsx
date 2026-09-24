import { Box, Typography } from '../../ui';
import { ContentRichText } from '../../content/content-rich-text';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { AboutTimelineHeadingProps } from './types';

export function AboutTimelineHeading(props: AboutTimelineHeadingProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.title)}
        content={
          <Typography variant="h2" visualVariant="aboutEditorialSectionTitle">
            {props.title}
          </Typography>
        }
      />
      <ConditionalContent
        condition={Boolean(props.description)}
        content={
          <Box visualVariant="aboutEditorialDescription">
            <ContentRichText content={props.description ?? {}} />
          </Box>
        }
      />
    </>
  );
}
