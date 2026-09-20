'use client';

import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import { getProfileBirthInfo, type AboutPageContentProps } from './types';
import { ProfileSummary } from './profile-summary';
import { ProfileTrajectory } from './profile-trajectory';
import { ProfileMilestones } from './profile-milestones';
import { AboutStory } from './about-story';
import { AboutIntroText } from './about-intro-text';
import { AboutProfileGrid } from './ui/profile-grid';

export function AboutPageContent(props: AboutPageContentProps) {
  const { page: staticPage, profile: staticProfile } = props;

  const t = useTranslations('Pages.about');

  const tNav = useTranslations('Nav');

  const page = staticPage;

  const profile = staticProfile;

  const { age, hasBirthInfo } = getProfileBirthInfo(profile);

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        breadcrumbs={[{ label: tNav('about') }]}
      />
      <AboutProfileGrid>
        <AboutIntroText page={page} />

        <ProfileSummary profile={profile} age={age} hasBirthInfo={hasBirthInfo} t={t} />
      </AboutProfileGrid>

      <AboutStory page={page} />

      <ProfileTrajectory profile={profile} t={t} />

      <ProfileMilestones profile={profile} t={t} />
    </>
  );
}
