'use client';

import type { CredentialSection } from './types';
import { ResumeSection } from './resume-section';
import { CredentialEntries } from './credential-entries';

type ResumeCredentialSectionProps = {
  section: CredentialSection;
};

export function ResumeCredentialSection(props: ResumeCredentialSectionProps) {
  return (
    <ResumeSection key={props.section.key} title={props.section.title}>
      <CredentialEntries items={props.section.items} />
    </ResumeSection>
  );
}
