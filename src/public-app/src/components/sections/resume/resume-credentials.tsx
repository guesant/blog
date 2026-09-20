'use client';

import type { ResumeCredentialsProps } from './types';
import { ResumeCredentialGroups } from './resume-credential-groups';
import { ResumeCredentialOptionalSections } from './resume-credential-optional-sections';

export function ResumeCredentials(props: ResumeCredentialsProps) {
  return (
    <>
      <ResumeCredentialGroups {...props} />
      <ResumeCredentialOptionalSections {...props} />
    </>
  );
}
