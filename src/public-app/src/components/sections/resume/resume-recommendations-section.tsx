import type { ResumeCredentialsProps } from './types';
import { RecommendationEntries } from './recommendation-entries';
import { ResumeOptionalSection } from './resume-optional-section';
import { ResumeSection } from './resume-section';

type ResumeRecommendationsSectionProps = ResumeCredentialsProps;

export function ResumeRecommendationsSection(props: ResumeRecommendationsSectionProps) {
  return (
    <ResumeOptionalSection
      condition={props.resume.recommendations.length > 0}
      content={
        <ResumeSection
          title={props.t('recommendations')}
          children={<RecommendationEntries items={props.resume.recommendations} />}
        />
      }
    />
  );
}
