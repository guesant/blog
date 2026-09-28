import { AboutEditorialSections } from './about-editorial-sections';
import { AboutIntroduction } from './about-introduction';
import { AboutTimeline } from './about-timeline';
import type { AboutEditorialBodyProps } from './types';
import { AboutEditorialPageFrame } from '../../ui/semantic/AboutEditorialPageFrame';

export function AboutEditorialBody(props: AboutEditorialBodyProps) {
  const sections = props.page.sections ?? [];

  const timelineItems = props.profile.milestones.filter((item) => !item.hidden);

  return (
    <AboutEditorialPageFrame>
      <AboutIntroduction content={props.page.introduction ?? {}} />
      <AboutTimeline
        profile={{ ...props.profile, milestones: timelineItems }}
        title={props.page.timelineTitle}
        description={props.page.timelineDescription}
        hasFollowingContent={sections.length > 0}
      />
      <AboutEditorialSections sections={sections} />
    </AboutEditorialPageFrame>
  );
}
