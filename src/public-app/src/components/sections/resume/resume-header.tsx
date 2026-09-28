'use client';

import { ResumeHeaderFrame } from '../../ui';
import { ActionSection } from '../../content/action-section';
import { ContactActionEmail } from '../../contact/contact-action-email';
import { ContactActionProfiles } from '../../contact/contact-action-profiles';
import type { ResumeHeaderProps } from './types';
import { ResumePdfActions } from './resume-pdf-actions';

export function ResumeHeader(props: ResumeHeaderProps) {
  const { page, profile, site, hasEmail, locale, pdfUrls, t, tExternalProfiles } = props;

  return (
    <ResumeHeaderFrame
      eyebrow={page.title}
      name={profile.name}
      title={profile.title}
      location={profile.location}
      documentActions={<ResumePdfActions locale={locale} pdfUrls={pdfUrls} t={t} />}
      contactActions={
        <ActionSection>
          <ContactActionEmail site={site} hasEmail={hasEmail} label={t('email')} />
          <ContactActionProfiles
            profiles={site.contact.profiles}
            tExternalProfiles={tExternalProfiles}
          />
        </ActionSection>
      }
    />
  );
}
