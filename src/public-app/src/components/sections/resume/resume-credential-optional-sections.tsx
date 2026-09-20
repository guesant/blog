import type { ResumeCredentialsProps } from './types';
import { ResumeAwardsSection } from './resume-awards-section';
import { ResumeEventsSection } from './resume-events-section';
import { ResumeRecommendationsSection } from './resume-recommendations-section';
import { ResumeTechnicalProductionSection } from './resume-technical-production-section';

type ResumeCredentialOptionalSectionsProps = ResumeCredentialsProps;

export function ResumeCredentialOptionalSections(props: ResumeCredentialOptionalSectionsProps) {
  return (
    <>
      <ResumeRecommendationsSection {...props} />

      <ResumeTechnicalProductionSection {...props} />

      <ResumeEventsSection {...props} />

      <ResumeAwardsSection {...props} />
    </>
  );
}
