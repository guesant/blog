import { HomeExperienceSection } from './home-experience-section';
import type { HomePageContent } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';

type HomeExperienceOptionalSectionProps = {
  content: HomePageContent;
  t: Translator;
};

export function HomeExperienceOptionalSection(props: HomeExperienceOptionalSectionProps) {
  return props.content.profile.trajectory.length > 0 ? (
    <HomeExperienceSection
      content={props.content}
      page={props.content.page}
      profile={props.content.profile}
      t={props.t}
    />
  ) : null;
}
