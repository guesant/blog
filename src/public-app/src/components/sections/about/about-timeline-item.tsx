import { ContentRichText } from '../../content/content-rich-text';
import type { AboutTimelineItemProps } from './types';
import { AboutTimelineEntryFrame } from '../../ui/semantic/AboutTimelineEntryFrame';
import { AboutTimelineItemFrame } from '../../ui/semantic/AboutTimelineItemFrame';
import { AboutTimelinePeriodText } from '../../ui/semantic/AboutTimelinePeriodText';
import { AboutTimelinePointFrame } from '../../ui/semantic/AboutTimelinePointFrame';
import { AboutTimelineRailFrame } from '../../ui/semantic/AboutTimelineRailFrame';
import { AboutTimelineTitleText } from '../../ui/semantic/AboutTimelineTitleText';

export function AboutTimelineItem(props: AboutTimelineItemProps) {
  return (
    <AboutTimelineItemFrame>
      <AboutTimelinePeriodText color="text.secondary">{props.item.year}</AboutTimelinePeriodText>
      <AboutTimelineRailFrame>
        <AboutTimelinePointFrame />
        <AboutTimelineEntryFrame>
          <AboutTimelineTitleText variant="h3">{props.item.title}</AboutTimelineTitleText>
          <ContentRichText content={props.item.description} />
        </AboutTimelineEntryFrame>
      </AboutTimelineRailFrame>
    </AboutTimelineItemFrame>
  );
}
