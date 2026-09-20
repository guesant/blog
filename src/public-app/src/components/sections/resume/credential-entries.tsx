'use client';

import { Typography } from '../../ui';
import type { CredentialEntriesProps } from './types';
import { ResumeEntryHeading } from './resume-entry-heading';
import { ResumeEntries } from './resume-entries';

export function CredentialEntries(props: CredentialEntriesProps) {
  const { items } = props;

  return (
    <ResumeEntries items={items}>
      {(item) => (
        <ResumeEntryHeading key={`${item.name}-${item.period}`} item={item}>
          <Typography variant="body2" visualVariant="credentialEntries">
            {item.issuer}
            {item.credentialId?.trim() ? ` · ${item.credentialId}` : ''}
          </Typography>
        </ResumeEntryHeading>
      )}
    </ResumeEntries>
  );
}
