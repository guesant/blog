import { Box, Typography } from '../../ui';
import { ContentRichText } from '../../content/content-rich-text';
import type { AboutTimelineItemProps } from './types';

export function AboutTimelineItem(props: AboutTimelineItemProps) {
  return (
    <Box visualVariant="aboutTimelineItem">
      <Typography color="text.secondary" visualVariant="aboutTimelinePeriod">
        {props.item.year}
      </Typography>
      <Box visualVariant="aboutTimelineRail">
        <Box visualVariant="aboutTimelinePoint" />
        <Box visualVariant="aboutTimelineEntry">
          <Typography variant="h3" visualVariant="aboutTimelineTitle">
            {props.item.title}
          </Typography>
          <ContentRichText content={props.item.description} />
        </Box>
      </Box>
    </Box>
  );
}
