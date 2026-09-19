'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { HomePageContent } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Link as LocaleLink } from '../../i18n/navigation';
import { ContactProfileGrid } from '../contact/contact-profile-grid';
import { ProtectedEmail } from '../contact/protected-email';
import { CaseShowcase } from '../content/case-showcase';
import { ProjectCard } from '../content/project-card';
import { SectionHeading } from '../content/section-heading';
import { TechnologyMarquee } from '../content/technology-marquee';
import { WritingRow } from '../content/writing-row';
import { Icon } from '../primitives/icon';
import { LayoutStack as Stack } from '../primitives/layout-stack';
import { ScrollReveal } from '../primitives/scroll-reveal';
import { TechnicalGrid } from '../primitives/technical-grid';

const sectionSx = {
  pt: { xs: '5.5rem', md: '7rem' },
  scrollMarginTop: '6rem',
} as const;

type EditableProps = Record<string, string | undefined>;
type EditableSource = Record<string, unknown>;

function selectedWorkTarget(hasCases: boolean, hasProjects: boolean, hasExperiments: boolean) {
  if (hasCases) {
    return '#work';
  }
  return hasProjects || hasExperiments ? '#projects' : null;
}

function getContactAvailability(site: HomePageContent['site']) {
  const hasEmail = site.contact.hasEmail;
  const hasProfiles = site.contact.profiles.length > 0;
  return { hasEmail, showContact: site.contact.available && (hasEmail || hasProfiles) };
}

type EyebrowProps = {
  children: ReactNode;
  editableProps?: EditableProps;
};

function Eyebrow(props: EyebrowProps) {
  const { children, editableProps } = props;
  return (
    <Typography variant="overline" color="text.secondary" {...editableProps}>
      {children}
    </Typography>
  );
}

type TextLinkProps = { href: string; children: ReactNode };

function TextLink(props: TextLinkProps) {
  const { href, children } = props;
  return (
    <Link
      component={LocaleLink}
      href={href}
      underline="none"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        color: 'text.primary',
        fontWeight: 600,
        fontSize: '.9rem',
        '&:hover': { color: 'secondary.main' },
      }}
    >
      {children} <Icon name="north-east" size={15} />
    </Link>
  );
}

type HomeWorkSectionProps = {
  cases: HomePageContent['cases'];
  page: HomePageContent['page'];
  pageSource: EditableSource;
  t: ReturnType<typeof useTranslations>;
};

function HomeWorkSection(props: HomeWorkSectionProps) {
  const { cases, page, pageSource, t } = props;
  return (
    <Box component="section" id="work" sx={{ ...sectionSx, pt: { xs: '5rem', md: '6rem' } }}>
      <SectionHeading
        eyebrow={page.workEyebrow}
        title={page.workTitle}
        description={page.workDescription}
        editableProps={{
          eyebrow: getEditableProps(pageSource, 'workEyebrow'),
          title: getEditableProps(pageSource, 'workTitle'),
          description: getEditableProps(pageSource, 'workDescription'),
        }}
        href="/cases"
        linkLabel={t('workAction')}
      />
      <ScrollReveal>
        <CaseShowcase cases={cases} />
      </ScrollReveal>
    </Box>
  );
}

type HomeProjectsSectionProps = {
  projects: HomePageContent['projects'];
  experiments: HomePageContent['experiments'];
  page: HomePageContent['page'];
  pageSource: EditableSource;
  t: ReturnType<typeof useTranslations>;
};

function HomeProjectsSection(props: HomeProjectsSectionProps) {
  const { projects, experiments, page, pageSource, t } = props;
  const hasProjects = projects.length > 0;
  const hasExperiments = experiments.length > 0;

  return (
    <Box component="section" id="projects" sx={sectionSx}>
      <SectionHeading
        eyebrow={page.projectsEyebrow}
        title={page.projectsTitle}
        description={page.projectsDescription}
        editableProps={{
          eyebrow: getEditableProps(pageSource, 'projectsEyebrow'),
          title: getEditableProps(pageSource, 'projectsTitle'),
          description: getEditableProps(pageSource, 'projectsDescription'),
        }}
        href="/projects"
        linkLabel={t('projectsAction')}
      />
      {hasProjects && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} highlighted={index === 0} />
          ))}
        </Box>
      )}
      {hasExperiments && (
        <Box
          sx={{
            mt: 3,
            pt: 2.5,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          <Typography
            {...getEditableProps(pageSource, 'experimentsSummary')}
            sx={{ color: 'text.secondary', fontSize: '.875rem' }}
          >
            {page.experimentsSummary.replace('{count}', String(experiments.length))}
          </Typography>
          <TextLink href="/projects#experiments">{t('browseLab')}</TextLink>
        </Box>
      )}
    </Box>
  );
}

type HomeExperienceSectionProps = {
  content: HomePageContent;
  page: HomePageContent['page'];
  pageSource: EditableSource;
  profile: HomePageContent['profile'];
  profileSource: EditableSource;
  t: ReturnType<typeof useTranslations>;
};

function HomeExperienceSection(props: HomeExperienceSectionProps) {
  const { content, page, pageSource, profile, profileSource, t } = props;
  return (
    <Box component="section" id="experience" sx={sectionSx}>
      <SectionHeading
        eyebrow={page.experienceEyebrow}
        title={page.experienceTitle}
        description={page.experienceDescription}
        editableProps={{
          eyebrow: getEditableProps(pageSource, 'experienceEyebrow'),
          title: getEditableProps(pageSource, 'experienceTitle'),
          description: getEditableProps(pageSource, 'experienceDescription'),
        }}
        href="/resume"
        linkLabel={t('experienceAction')}
      />
      <Box>
        {profile.trajectory.map((item, index) => {
          const trajectorySources = Array.isArray(profileSource.trajectory)
            ? (profileSource.trajectory as Record<string, unknown>[])
            : [];
          const itemSource = trajectorySources[index];
          return (
            <ScrollReveal key={`${item.organization}-${item.period}`} delay={index * 0.04}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '9rem minmax(0, 1fr)' },
                  gap: { xs: 1.25, sm: 4 },
                  py: { xs: 3, md: 3.5 },
                  borderTop: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography
                  {...getEditableProps(itemSource, 'period')}
                  sx={{ fontSize: '.8125rem', color: 'text.secondary', pt: 0.35 }}
                >
                  {item.period}
                </Typography>
                <Box>
                  <Typography
                    variant="h3"
                    {...getEditableProps(itemSource, 'role')}
                    sx={{ fontSize: '1.25rem' }}
                  >
                    {item.role}
                  </Typography>
                  <Typography
                    color="primary"
                    {...getEditableProps(itemSource, 'organization')}
                    sx={{ mt: 0.5, fontWeight: 600, fontSize: '.9rem' }}
                  >
                    {item.organization}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    {...getEditableProps(itemSource, 'highlights')}
                    sx={{ mt: 1.25, maxWidth: '68ch', fontSize: '.925rem' }}
                  >
                    {(item.highlights ?? []).join(' ')}
                  </Typography>
                </Box>
              </Box>
            </ScrollReveal>
          );
        })}
      </Box>

      {profile.interests?.trim() && (
        <Box sx={{ mt: 4, py: 3, borderTop: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Eyebrow editableProps={getEditableProps(pageSource, 'currentlyExploringLabel')}>
            {page.currentlyExploringLabel}
          </Eyebrow>
          <Typography
            {...getEditableProps(profileSource, 'interests')}
            sx={{ mt: 1.25, color: 'text.secondary', maxWidth: '72ch' }}
          >
            {profile.interests}
          </Typography>
        </Box>
      )}

      <TechnologyMarquee
        technologies={content.recurringTechnologies}
        label={page.recurringTechnologiesLabel}
        labelEditableProps={getEditableProps(pageSource, 'recurringTechnologiesLabel')}
      />
    </Box>
  );
}

type HomeContactSectionProps = {
  page: HomePageContent['page'];
  pageSource: EditableSource;
  site: HomePageContent['site'];
  contactSource: EditableSource;
  showContact: boolean;
  hasEmail: boolean;
  t: ReturnType<typeof useTranslations>;
  tExternalProfiles: ReturnType<typeof useTranslations>;
};

export function HomeContactSection(props: HomeContactSectionProps) {
  const { page, pageSource, site, contactSource, showContact, hasEmail, t, tExternalProfiles } =
    props;
  if (!showContact) {
    return null;
  }

  return (
    <Box component="section" id="contact" sx={{ ...sectionSx, pb: { xs: '4rem', md: '6rem' } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
          gap: { xs: 4, md: 8 },
          alignItems: 'start',
          py: { xs: '4rem', md: '5rem' },
          borderTop: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box>
          <Eyebrow editableProps={getEditableProps(pageSource, 'contactEyebrow')}>
            {page.contactEyebrow}
          </Eyebrow>
          <Typography
            variant="h2"
            {...getEditableProps(pageSource, 'contactTitle')}
            sx={{ mt: 1.5, maxWidth: '20ch' }}
          >
            {page.contactTitle}
          </Typography>
        </Box>
        <Box>
          <Typography
            color="text.secondary"
            {...getEditableProps(pageSource, 'contactDescription')}
            sx={{ mb: 3.5, maxWidth: '50ch' }}
          >
            {page.contactDescription}
          </Typography>
          <Stack sx={{ gap: 'var(--site-space-3)', minWidth: 0 }}>
            {hasEmail && (
              <ProtectedEmail
                challenge={site.contact.emailChallenge}
                label={t('contactEmailButton')}
                variant="button"
              />
            )}
            {site.contact.profiles.length > 0 && (
              <Box {...getEditableProps(contactSource, 'profiles')}>
                <ContactProfileGrid
                  profiles={site.contact.profiles}
                  tExternalProfiles={tExternalProfiles}
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

type HomePageProps = { content: HomePageContent };

type HomeAvailabilityProps = {
  page: HomePageContent['page'];
  pageSource: EditableSource;
  contactSource: EditableSource;
  showContact: boolean;
};

function HomeAvailability(props: HomeAvailabilityProps) {
  const { page, pageSource, contactSource, showContact } = props;
  if (!showContact) {
    return null;
  }
  return (
    <Stack
      direction="row"
      sx={{
        position: 'relative',
        zIndex: 1,
        mt: 6,
        pt: 2.5,
        gap: 1.25,
        alignItems: 'center',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        aria-hidden
        {...getEditableProps(contactSource, 'available')}
        sx={{ width: '.5rem', height: '.5rem', borderRadius: '50%', bgcolor: 'success.main' }}
      />
      <Typography
        {...getEditableProps(pageSource, 'availableLabel')}
        sx={{ fontSize: '.9rem', fontWeight: 550, color: 'success.main' }}
      >
        {page.availableLabel}
      </Typography>
    </Stack>
  );
}

type HomeHeroProps = {
  page: HomePageContent['page'];
  pageSource: EditableSource;
  profile: HomePageContent['profile'];
  profileRaw: EditableSource;
  contactSource: EditableSource;
  showContact: boolean;
  workTarget: string | null;
  t: ReturnType<typeof useTranslations>;
};

export function HomeHero(props: HomeHeroProps) {
  const { page, pageSource, profile, profileRaw, contactSource, showContact, workTarget, t } =
    props;
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        pt: { xs: '4.5rem', md: '6rem' },
        pb: { xs: 7, md: 9 },
      }}
    >
      <TechnicalGrid />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: { xs: '100%', md: '72%' },
          maxWidth: '50rem',
        }}
      >
        <Eyebrow editableProps={getEditableProps(pageSource, 'heroIdentity')}>
          {page.heroIdentity}
        </Eyebrow>
        <Typography
          variant="h1"
          {...getEditableProps(profileRaw, 'name')}
          sx={{ mt: 2, fontSize: 'var(--site-text-3xl)', maxWidth: '14ch' }}
        >
          {profile.name}
        </Typography>
        <Typography sx={{ mt: 1, fontWeight: 600, color: 'primary.main' }}>
          {profile.title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {profile.location}
        </Typography>
        <Typography
          component="p"
          {...getEditableProps(pageSource, 'heroExperience')}
          sx={{
            mt: 3.5,
            maxWidth: '43ch',
            fontFamily: 'var(--font-serif)',
            fontSize: 'var(--site-text-2xl)',
            fontWeight: 600,
            letterSpacing: '-.022em',
            lineHeight: 1.25,
          }}
        >
          {page.heroExperience}
        </Typography>
        <Typography
          {...getEditableProps(pageSource, 'heroCurrentFocus')}
          sx={{ mt: 2.5, maxWidth: '62ch', color: 'text.secondary' }}
        >
          {page.heroCurrentFocus}
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ gap: { xs: 2, sm: 3 }, mt: 4, alignItems: { sm: 'center' } }}
        >
          {workTarget && (
            <Button
              component={LocaleLink}
              href={workTarget}
              size="large"
              variant="contained"
              endIcon={<Icon name="arrow" size={16} />}
            >
              {t('selectedWork')}
            </Button>
          )}
          <TextLink href="/about">{t('aboutMe')}</TextLink>
        </Stack>
      </Box>
      <HomeAvailability
        page={page}
        pageSource={pageSource}
        contactSource={contactSource}
        showContact={showContact}
      />
    </Box>
  );
}

type HomeWritingSectionProps = {
  writings: HomePageContent['writings'];
  page: HomePageContent['page'];
  pageSource: EditableSource;
  t: ReturnType<typeof useTranslations>;
};

function HomeWritingSection(props: HomeWritingSectionProps) {
  const { writings, page, pageSource, t } = props;
  if (writings.length === 0) {
    return null;
  }
  return (
    <Box component="section" id="writing" sx={sectionSx}>
      <SectionHeading
        eyebrow={page.writingEyebrow}
        title={page.writingTitle}
        description={page.writingDescription}
        editableProps={{
          eyebrow: getEditableProps(pageSource, 'writingEyebrow'),
          title: getEditableProps(pageSource, 'writingTitle'),
          description: getEditableProps(pageSource, 'writingDescription'),
        }}
        href="/writing"
        linkLabel={t('writingAction')}
      />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {writings.slice(0, 3).map((writing) => (
          <WritingRow key={writing.slug} writing={writing} />
        ))}
      </Box>
    </Box>
  );
}

export function HomePage(props: HomePageProps) {
  const { content } = props;
  const t = useTranslations('Home');
  const tExternalProfiles = useTranslations('ExternalProfiles');
  const { content: page, source: pageSource } = useEditableContent(content.page);
  const {
    content: profile,
    source: profileSource,
    raw: profileRaw,
  } = useEditableContent(content.profile);
  const { content: site, raw: siteSource } = useEditableContent(content.site);
  const contactSource = siteSource.contact as Record<string, unknown>;
  const hasCases = content.cases.length > 0;
  const hasProjects = content.projects.length > 0;
  const hasExperiments = content.experiments.length > 0;
  const hasExperience = profile.trajectory.length > 0;
  const { hasEmail, showContact } = getContactAvailability(site);
  const workTarget = selectedWorkTarget(hasCases, hasProjects, hasExperiments);

  return (
    <Box id="top">
      <HomeHero
        page={page}
        pageSource={pageSource}
        profile={profile}
        profileRaw={profileRaw}
        contactSource={contactSource}
        showContact={showContact}
        workTarget={workTarget}
        t={t}
      />

      {hasCases && (
        <HomeWorkSection cases={content.cases} page={page} pageSource={pageSource} t={t} />
      )}

      {(hasProjects || hasExperiments) && (
        <HomeProjectsSection
          projects={content.projects}
          experiments={content.experiments}
          page={page}
          pageSource={pageSource}
          t={t}
        />
      )}

      {hasExperience && (
        <HomeExperienceSection
          content={content}
          page={page}
          pageSource={pageSource}
          profile={profile}
          profileSource={profileSource}
          t={t}
        />
      )}

      <HomeWritingSection writings={content.writings} page={page} pageSource={pageSource} t={t} />

      <HomeContactSection
        page={page}
        pageSource={pageSource}
        site={site}
        contactSource={contactSource}
        showContact={showContact}
        hasEmail={hasEmail}
        t={t}
        tExternalProfiles={tExternalProfiles}
      />
    </Box>
  );
}
