import { ConditionalContent } from '../../primitives/conditional-content';
import { AboutTimelineHeading } from './about-timeline-heading';
import { AboutTimelineItems } from './about-timeline-items';
import type { AboutTimelineProps } from './types';
import { AboutSectionDivider } from '../../ui/semantic/AboutSectionDivider';
import { AboutTimelineSectionFrame } from '../../ui/semantic/AboutTimelineSectionFrame';

export function AboutTimeline(props: AboutTimelineProps) {
  if (props.profile.milestones.length === 0) {
    return null;
  }

  const hasHeading = Boolean(props.title || props.description);

  return (
    <AboutTimelineSectionFrame>
      <ConditionalContent
        condition={hasHeading}
        content={<AboutTimelineHeading title={props.title} description={props.description} />}
      />
      <AboutTimelineItems items={props.profile.milestones} />
      <ConditionalContent condition={props.hasFollowingContent} content={<AboutSectionDivider />} />
    </AboutTimelineSectionFrame>
  );
}
