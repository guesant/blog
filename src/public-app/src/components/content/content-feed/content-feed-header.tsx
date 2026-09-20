'use client';

import { Box, Typography } from '../../ui';
import type { FeedPageCopy } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';

type ContentFeedHeaderProps = { copy: FeedPageCopy; visible: boolean };

export function ContentFeedHeader(props: ContentFeedHeaderProps) {
  return (
    <ConditionalContent
      condition={props.visible}
      content={
        <Box component="header" visualVariant="contentFeedHeader">
          <Typography variant="h1">{props.copy.title}</Typography>
          <ConditionalContent
            condition={Boolean(props.copy.description)}
            content={
              <Typography color="text.secondary" visualVariant="contentFeedHeader">
                {props.copy.description}
              </Typography>
            }
          />
        </Box>
      }
    />
  );
}
