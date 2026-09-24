import { Box, Divider } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { AboutTimelineHeading } from './about-timeline-heading';
import { AboutTimelineItems } from './about-timeline-items';
import type { AboutTimelineProps } from './types';

export function AboutTimeline(props: AboutTimelineProps) {
  if (props.profile.milestones.length === 0) {
    return null;
  }

  const hasHeading = Boolean(props.title || props.description);

  return (
    <Box visualVariant="aboutTimelineSection">
      <ConditionalContent
        condition={hasHeading}
        content={<AboutTimelineHeading title={props.title} description={props.description} />}
      />
      <AboutTimelineItems items={props.profile.milestones} />
      <ConditionalContent
        condition={props.hasFollowingContent}
        content={<Divider visualVariant="aboutSectionDivider" />}
      />
    </Box>
  );
}
