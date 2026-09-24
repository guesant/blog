import { AboutTimelineItem } from './about-timeline-item';
import type { AboutTimelineItemsProps } from './types';

export function AboutTimelineItems(props: AboutTimelineItemsProps) {
  return (
    <>
      {props.items.map((item) => (
        <AboutTimelineItem key={item.year + item.title} item={item} />
      ))}
    </>
  );
}
