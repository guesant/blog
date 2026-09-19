'use client';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { NavigationAvailability, Profile, SiteText } from '@portfolio/content/types';
import { useTranslations } from '@/i18n/compat';
import type { ReactNode } from 'react';
import { externalProfileLabel } from '../../content/external-profiles';
import { issueReportUrl, sourceRepositoryUrl } from '../../content/project';
import { Link as LocaleLink } from '../../i18n/navigation';
import { ProtectedEmail } from '../contact/protected-email';
import { ExternalLink } from '../primitives/external-link';
import { LayoutStack as Stack } from '../primitives/layout-stack';
import { ProfileIcon } from '../primitives/profile-icon';

type SiteMapLink = { label: string; href: string };

function getSiteMapLinks(
  availability: NavigationAvailability,
  tNav: ReturnType<typeof useTranslations>,
): SiteMapLink[] {
  return [
    { label: tNav('home'), href: '/' },
    availability.cases && { label: tNav('work'), href: '/cases' },
    availability.projects && { label: tNav('projects'), href: '/projects' },
    availability.writing && { label: tNav('writing'), href: '/writing' },
    availability.achados && { label: tNav('achados'), href: '/findings' },
    { label: tNav('about'), href: '/about' },
    availability.contact && { label: tNav('contact'), href: '/contact' },
    { label: tNav('resume'), href: '/resume' },
  ].filter((link): link is SiteMapLink => Boolean(link));
}

type FooterGroupProps = { label: string; children: ReactNode };

function FooterGroup(props: FooterGroupProps) {
  const { label, children } = props;
  return (
    <Stack sx={{ gap: 1.25, alignItems: 'flex-start' }}>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ display: 'block', lineHeight: 1, opacity: 0.7 }}
      >
        {label}
      </Typography>
      <Stack sx={{ gap: 1, alignItems: 'flex-start' }}>{children}</Stack>
    </Stack>
  );
}

type SiteFooterProps = {
  site: SiteText;
  profile: Profile;
  availability: NavigationAvailability;
};

export function SiteFooter(props: SiteFooterProps) {
  const { site: staticSite, profile: staticProfile, availability } = props;
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const tExternalProfiles = useTranslations('ExternalProfiles');
  const { content: site, source, raw } = useEditableContent(staticSite);
  const { content: profile } = useEditableContent(staticProfile);
  const contactSource = raw.contact as Record<string, unknown>;
  const siteMapLinks = getSiteMapLinks(availability, tNav);
  const copyright = site.copyrightTemplate
    .replace('{year}', String(new Date().getFullYear()))
    .replace('{name}', profile.name);
  const hasProfiles = site.contact.profiles.length > 0;
  const hasEmail = site.contact.hasEmail;
  return (
    <>
      <Divider sx={{ mt: 8 }} />
      <Stack component="footer" sx={{ gap: 3, py: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(4, minmax(0, 1fr))',
            },
            gap: { xs: 3, sm: 4 },
          }}
        >
          <FooterGroup label={t('sitemapLabel')}>
            {siteMapLinks.map((link) => (
              <Link
                key={link.href}
                component={LocaleLink}
                href={link.href}
                variant="body2"
                color="text.secondary"
              >
                {link.label}
              </Link>
            ))}
          </FooterGroup>

          <FooterGroup label={t('legalLabel')}>
            <Link component={LocaleLink} href="/license" variant="body2" color="text.secondary">
              {t('license')}
            </Link>
            <Link component={LocaleLink} href="/credits" variant="body2" color="text.secondary">
              {t('credits')}
            </Link>
          </FooterGroup>

          {(hasProfiles || hasEmail) && (
            <FooterGroup label={t('connectLabel')}>
              {hasProfiles && (
                <Box
                  {...getEditableProps(contactSource, 'profiles')}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  {site.contact.profiles.map((profile) => (
                    <ExternalLink
                      key={profile.url}
                      href={profile.url}
                      variant="body2"
                      color="text.secondary"
                    >
                      <ProfileIcon platform={profile.platform} size={15} />
                      {externalProfileLabel(profile, tExternalProfiles)}
                    </ExternalLink>
                  ))}
                </Box>
              )}
              {hasEmail && (
                <ProtectedEmail
                  challenge={site.contact.emailChallenge}
                  label={t('email')}
                  color="text.secondary"
                  typographyVariant="body2"
                  sx={{ fontWeight: 400 }}
                />
              )}
            </FooterGroup>
          )}

          <FooterGroup label={t('projectLabel')}>
            <ExternalLink href={issueReportUrl} variant="body2" color="text.secondary">
              {t('issueReport')}
            </ExternalLink>
            <ExternalLink href={sourceRepositoryUrl} variant="body2" color="text.secondary">
              {t('fork')}
            </ExternalLink>
          </FooterGroup>
        </Box>

        <Divider />

        <Typography
          variant="body2"
          color="text.secondary"
          {...getEditableProps(source, 'copyrightTemplate')}
        >
          {copyright}
        </Typography>
      </Stack>
    </>
  );
}
