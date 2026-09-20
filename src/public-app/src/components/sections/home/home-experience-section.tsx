'use client';

import { Box } from '../../ui';
import { SectionHeading } from '../../content/section-heading';
import { TechnologyMarquee } from '../../content/technology-marquee';
import type { HomeExperienceSectionProps } from './types';
import { Eyebrow } from './ui/eyebrow';
import { HomeExperienceItem } from './home-experience-item';
import { HomeExperienceCopy } from './ui/home-experience-copy';
import { HomeExperienceSurface } from './ui/home-experience-surface';
import { HomeSectionSurface } from './ui/home-section-surface';
import { ConditionalContent } from '../../primitives/conditional-content';

export function HomeExperienceSection(props: HomeExperienceSectionProps) {
  const { content, page, profile, t } = props;

  return (
    <HomeSectionSurface id="experience">
      <SectionHeading
        eyebrow={page.experienceEyebrow}
        title={page.experienceTitle}
        description={page.experienceDescription}
        href="/resume"
        linkLabel={t('experienceAction')}
      />
      <Box>
        {profile.trajectory.map((item, index) => (
          <HomeExperienceItem key={item.organization + item.period} item={item} index={index} />
        ))}
      </Box>

      <ConditionalContent
        condition={Boolean(profile.interests?.trim())}
        content={
          <HomeExperienceSurface>
            <Eyebrow>{page.currentlyExploringLabel}</Eyebrow>
            <HomeExperienceCopy>{profile.interests}</HomeExperienceCopy>
          </HomeExperienceSurface>
        }
      />

      <TechnologyMarquee
        technologies={content.recurringTechnologies}
        label={page.recurringTechnologiesLabel}
      />
    </HomeSectionSurface>
  );
}
