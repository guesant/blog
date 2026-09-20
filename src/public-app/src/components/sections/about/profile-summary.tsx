'use client';

import { Paper } from '../../ui';
import type { ProfileSummaryProps } from './types';
import { ProfileSummaryIdentity } from './profile-summary-identity';
import { ProfileSummarySection } from './profile-summary-section';
import { ProfileSummaryInterests } from './profile-summary-interests';

export function ProfileSummary(props: ProfileSummaryProps) {
  return (
    <Paper variant="outlined" visualVariant="profileSummary">
      <ProfileSummaryIdentity {...props} />
      {[
        { title: props.t('interests'), text: props.profile.interests, field: 'interests' },
        { title: props.t('learning'), text: props.profile.learning, field: 'learning' },
      ].map((section) => (
        <ProfileSummarySection key={section.field} title={section.title} text={section.text} />
      ))}
      <ProfileSummaryInterests profile={props.profile} t={props.t} />
    </Paper>
  );
}
