'use client';

import { Box, Typography } from '../../ui';
import { ContentRichText } from '../../content/content-rich-text';
import type { AboutStoryProps } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';

export function AboutStory(props: AboutStoryProps) {
  const { page } = props;

  if (!page.story) {
    return null;
  }

  return (
    <Box visualVariant="aboutStory">
      <ConditionalContent
        condition={Boolean(page.storyEyebrow)}
        content={
          <Typography variant="overline" color="text.secondary" visualVariant="aboutStory">
            {page.storyEyebrow}
          </Typography>
        }
      />
      <ConditionalContent
        condition={Boolean(page.storyTitle)}
        content={
          <Typography variant="h2" visualVariant="aboutStory2">
            {page.storyTitle}
          </Typography>
        }
      />
      <Box visualVariant="aboutStory2">
        <ContentRichText content={page.story} />
      </Box>
    </Box>
  );
}
