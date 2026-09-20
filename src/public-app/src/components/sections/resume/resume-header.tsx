'use client';

import { Box, Typography } from '../../ui';
import type { ResumeHeaderProps } from './types';
import { ResumePdfActions } from './resume-pdf-actions';
import { ResumeHeaderContact } from './resume-header-contact';

export function ResumeHeader(props: ResumeHeaderProps) {
  const { page, profile, site, hasEmail, hasProfiles, locale, pdfUrls, t, tExternalProfiles } =
    props;

  return (
    <Box component="header" visualVariant="resumeHeader">
      <Typography variant="overline" color="primary">
        {page.title}
      </Typography>
      <Typography component="h1" variant="h2" visualVariant="resumeHeader">
        {profile.name}
      </Typography>
      <Typography visualVariant="resumeHeader2">{profile.title}</Typography>
      <Typography variant="body2" color="text.secondary" visualVariant="resumeHeader3">
        {profile.location}
      </Typography>
      <Box visualVariant="resumeHeader2">
        <ResumePdfActions locale={locale} pdfUrls={pdfUrls} t={t} />
      </Box>
      <ResumeHeaderContact
        site={site}
        hasEmail={hasEmail}
        hasProfiles={hasProfiles}
        t={t}
        tExternalProfiles={tExternalProfiles}
      />
    </Box>
  );
}
