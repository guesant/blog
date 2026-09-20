'use client';

import { useTranslations } from '@/i18n/compat';
import { externalProfileLabel } from '@portfolio/data/config/external-profiles';
import { ExternalLink } from '../../primitives/external-link';
import type { ResumeProfile } from './types';

type ResumeProfileLinkProps = {
  profile: ResumeProfile;
  tExternalProfiles: ReturnType<typeof useTranslations>;
};

export function ResumeProfileLink(props: ResumeProfileLinkProps) {
  return (
    <ExternalLink href={props.profile.url} variant="body2">
      {externalProfileLabel(props.profile, props.tExternalProfiles)}
    </ExternalLink>
  );
}
