import type { ResumeCredentialsProps } from './types';
import { RecommendationEntries } from './recommendation-entries';
import { ResumeCredentialSection } from './resume-credential-section';

type ResumeRecommendationsSectionProps = ResumeCredentialsProps;

export function ResumeRecommendationsSection(props: ResumeRecommendationsSectionProps) {
  return (
    <ResumeCredentialSection
      condition={props.resume.recommendations.length > 0}
      title={props.t('recommendations')}
      entries={<RecommendationEntries items={props.resume.recommendations} />}
    />
  );
}
