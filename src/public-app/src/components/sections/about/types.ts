import type { AboutPageCopy, Profile } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { calculateAge } from './calculate-age';

export function getProfileBirthInfo(profile: Profile) {
  const age = profile.birthDate?.trim() ? calculateAge(profile.birthDate) : undefined;

  return { age, hasBirthInfo: age !== undefined || Boolean(profile.birthCity?.trim()) };
}

export type AboutPageContentProps = {
  page: AboutPageCopy;
  profile: Profile;
};

export type ProfileSummaryProps = {
  profile: Profile;
  age: number | undefined;
  hasBirthInfo: boolean;
  t: ReturnType<typeof useTranslations>;
};

export type ProfileBirthDetailsProps = Pick<
  ProfileSummaryProps,
  'profile' | 'age' | 'hasBirthInfo' | 't'
>;

export type ProfileTrajectoryProps = {
  profile: Profile;
  t: ReturnType<typeof useTranslations>;
};

export type ProfileMilestonesProps = {
  profile: Profile;
  t: ReturnType<typeof useTranslations>;
};

export type AboutStoryProps = {
  page: AboutPageCopy;
};
