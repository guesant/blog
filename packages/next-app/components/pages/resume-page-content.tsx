'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { CaseStudy, ResumePageContent as ResumeContent } from '@portfolio/content/types';
import { useLocale, useTranslations } from 'next-intl';
import { type MouseEvent, type ReactNode, useState } from 'react';
import { externalProfileLabel } from '../../content/external-profiles';
import { Link as LocaleLink } from '../../i18n/navigation';
import { routing } from '../../i18n/routing';
import { ProtectedEmail } from '../contact/protected-email';
import { Breadcrumbs } from '../navigation/breadcrumbs';
import { ExternalLink } from '../primitives/external-link';
import { Icon } from '../primitives/icon';

const pdfLocaleLabels: Record<string, string> = { en: 'English', 'pt-BR': 'Português' };
type EditableSource = Record<string, unknown>;

function sourceArray(source: EditableSource, field: string) {
  return Array.isArray(source[field]) ? (source[field] as EditableSource[]) : [];
}

function contactSourceFrom(source: EditableSource) {
  return source.contact && typeof source.contact === 'object'
    ? (source.contact as EditableSource)
    : {};
}

type ResumePdfActionsProps = { locale: string; t: (key: string) => string };

function ResumePdfActions(props: ResumePdfActionsProps) {
  const { locale, t } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const openMenu = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <ButtonGroup variant="outlined" size="small">
        <Button
          component="a"
          href={`/resume-${locale}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('viewPdf')}
        </Button>
        <Button
          onClick={openMenu}
          aria-label={t('pdfOptions')}
          aria-haspopup="menu"
          aria-expanded={Boolean(anchorEl)}
          sx={{ px: 1 }}
        >
          <Icon name="chevron-down" size={16} />
        </Button>
      </ButtonGroup>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        {routing.locales.flatMap((item) => [
          <ListSubheader key={`${item}-heading`} disableSticky>
            {pdfLocaleLabels[item] ?? item}
          </ListSubheader>,
          <MenuItem
            key={`${item}-view`}
            component="a"
            href={`/resume-${item}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            {t('viewPdf')}
          </MenuItem>,
          <MenuItem
            key={`${item}-download`}
            component="a"
            href={`/resume-${item}.pdf`}
            download
            onClick={closeMenu}
          >
            {t('downloadPdf')}
          </MenuItem>,
        ])}
      </Menu>
    </Box>
  );
}

type ResumeSectionProps = { title: string; children: ReactNode };

function ResumeSection(props: ResumeSectionProps) {
  const { title, children } = props;
  return (
    <Box component="section" sx={{ mt: { xs: 4, md: 5 } }}>
      <Typography
        component="h2"
        variant="overline"
        sx={{ display: 'block', color: 'text.primary', fontWeight: 700, letterSpacing: '0.12em' }}
      >
        {title}
      </Typography>
      <Divider sx={{ mt: 0.5, mb: 2 }} />
      {children}
    </Box>
  );
}

type EditableNamedItem = { name: string; url?: string };

type EditableItemNameProps = {
  item: EditableNamedItem;
  source: EditableSource | undefined;
};

function EditableItemName(editableItemNameProps: EditableItemNameProps) {
  const { item, source } = editableItemNameProps;
  return item.url?.trim() ? (
    <ExternalLink href={item.url} {...getEditableProps(source, 'name')} sx={{ fontWeight: 700 }}>
      {item.name}
    </ExternalLink>
  ) : (
    <Typography {...getEditableProps(source, 'name')} sx={{ fontWeight: 700 }}>
      {item.name}
    </Typography>
  );
}

type ResumeEntryGridProps = { children: ReactNode };

function ResumeEntryGrid(props: ResumeEntryGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
        columnGap: 3,
        rowGap: 0.25,
      }}
    >
      {props.children}
    </Box>
  );
}

type EntryPeriodProps = { period: string; source: EditableSource | undefined };

function EntryPeriod(props: EntryPeriodProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      {...getEditableProps(props.source, 'period')}
    >
      {props.period}
    </Typography>
  );
}

type ResumeEntryHeadingProps = {
  item: EditableNamedItem & { period: string };
  source: EditableSource | undefined;
  children: ReactNode;
};

function ResumeEntryHeading(props: ResumeEntryHeadingProps) {
  return (
    <ResumeEntryGrid>
      <EditableItemName item={props.item} source={props.source} />
      <EntryPeriod period={props.item.period} source={props.source} />
      {props.children}
    </ResumeEntryGrid>
  );
}

type EntryDescriptionProps = { description?: string; source: EditableSource | undefined };

function EntryDescription(props: EntryDescriptionProps) {
  if (!props.description?.trim()) {
    return null;
  }
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      {...getEditableProps(props.source, 'description')}
      sx={{ mt: 0.5 }}
    >
      {props.description}
    </Typography>
  );
}

type ResumeEntriesProps<Item extends { name: string; period: string }> = {
  items: Item[];
  children: (item: Item, index: number) => ReactNode;
};

function ResumeEntries<Item extends { name: string; period: string }>(
  props: ResumeEntriesProps<Item>,
) {
  return <Box sx={{ display: 'grid', gap: 2 }}>{props.items.map(props.children)}</Box>;
}

type TrajectoryEntriesProps = {
  items: { organization: string; period: string; role: string; highlights?: string[] }[];
  itemSources: EditableSource[];
};

function TrajectoryEntries(props: TrajectoryEntriesProps) {
  const { items, itemSources } = props;
  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      {items.map((item, index) => (
        <Box key={`${item.organization}-${item.period}`}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
              columnGap: 3,
              rowGap: 0.25,
            }}
          >
            <Typography
              {...getEditableProps(itemSources[index], 'organization')}
              sx={{ fontWeight: 700 }}
            >
              {item.organization}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              {...getEditableProps(itemSources[index], 'period')}
            >
              {item.period}
            </Typography>
            <Typography
              variant="body2"
              {...getEditableProps(itemSources[index], 'role')}
              sx={{ gridColumn: { sm: '1 / -1' }, fontStyle: 'italic' }}
            >
              {item.role}
            </Typography>
          </Box>
          <Box
            component="ul"
            {...getEditableProps(itemSources[index], 'highlights')}
            sx={{ m: 0, mt: 1, pl: 2.25, color: 'text.secondary' }}
          >
            {(item.highlights ?? []).map((highlight) => (
              <Typography component="li" variant="body2" key={highlight} sx={{ mb: 0.25 }}>
                {highlight}
              </Typography>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

type EducationEntriesProps = {
  items: { institution: string; location: string; degree: string; period: string }[];
  itemSources: EditableSource[];
};

function EducationEntries(props: EducationEntriesProps) {
  const { items, itemSources } = props;
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {items.map((item, index) => (
        <Box
          key={`${item.institution}-${item.period}`}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
            columnGap: 3,
            rowGap: 0.25,
          }}
        >
          <Typography
            {...getEditableProps(itemSources[index], 'institution')}
            sx={{ fontWeight: 700 }}
          >
            {item.institution}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            {...getEditableProps(itemSources[index], 'period')}
          >
            {item.period}
          </Typography>
          <Typography
            variant="body2"
            {...getEditableProps(itemSources[index], 'degree')}
            sx={{ fontStyle: 'italic' }}
          >
            {item.degree}
          </Typography>
          {item.location && (
            <Typography
              variant="body2"
              color="text.secondary"
              {...getEditableProps(itemSources[index], 'location')}
            >
              {item.location}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

type CredentialEntriesProps = {
  items: { name: string; issuer: string; url?: string; period: string; credentialId?: string }[];
  itemSources: EditableSource[];
};

function CredentialEntries(props: CredentialEntriesProps) {
  const { items, itemSources } = props;
  return (
    <ResumeEntries items={items}>
      {(item, index) => (
        <ResumeEntryHeading
          key={`${item.name}-${item.period}`}
          item={item}
          source={itemSources[index]}
        >
          <Typography
            variant="body2"
            {...getEditableProps(itemSources[index], 'issuer')}
            sx={{ fontStyle: 'italic' }}
          >
            {item.issuer}
            {item.credentialId?.trim() ? ` · ${item.credentialId}` : ''}
          </Typography>
        </ResumeEntryHeading>
      )}
    </ResumeEntries>
  );
}

type RecommendationEntriesProps = {
  items: { author: string; role: string; quote: string; url?: string; period?: string }[];
  itemSources: EditableSource[];
};

function RecommendationEntries(props: RecommendationEntriesProps) {
  const { items, itemSources } = props;
  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      {items.map((item, index) => (
        <Box key={`${item.author}-${item.period}`}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
              columnGap: 3,
              rowGap: 0.25,
            }}
          >
            {item.url?.trim() ? (
              <ExternalLink
                href={item.url}
                {...getEditableProps(itemSources[index], 'author')}
                sx={{ fontWeight: 700 }}
              >
                {item.author}
              </ExternalLink>
            ) : (
              <Typography
                {...getEditableProps(itemSources[index], 'author')}
                sx={{ fontWeight: 700 }}
              >
                {item.author}
              </Typography>
            )}
            {item.period && (
              <Typography
                variant="body2"
                color="text.secondary"
                {...getEditableProps(itemSources[index], 'period')}
              >
                {item.period}
              </Typography>
            )}
            <Typography
              variant="body2"
              color="text.secondary"
              {...getEditableProps(itemSources[index], 'role')}
              sx={{ gridColumn: { sm: '1 / -1' }, fontStyle: 'italic' }}
            >
              {item.role}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            {...getEditableProps(itemSources[index], 'quote')}
            sx={{ mt: 1 }}
          >
            “{item.quote}”
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

type TechnicalProductionEntriesProps = {
  items: {
    name: string;
    kind?: string;
    description?: string;
    url?: string;
    period: string;
    projectHref?: string;
  }[];
  itemSources: EditableSource[];
};

function TechnicalProductionEntries(props: TechnicalProductionEntriesProps) {
  const { items, itemSources } = props;
  return (
    <ResumeEntries items={items}>
      {(item, index) => (
        <Box key={`${item.name}-${item.period}`}>
          <ResumeEntryHeading item={item} source={itemSources[index]}>
            {item.kind && (
              <Typography
                variant="body2"
                color="text.secondary"
                {...getEditableProps(itemSources[index], 'kind')}
                sx={{ gridColumn: { sm: '1 / -1' }, fontStyle: 'italic' }}
              >
                {item.kind}
                {item.projectHref?.trim() ? (
                  <>
                    {' · '}
                    <ExternalLink
                      href={item.projectHref}
                      {...getEditableProps(itemSources[index], 'projectHref')}
                    >
                      {item.projectHref}
                    </ExternalLink>
                  </>
                ) : null}
              </Typography>
            )}
          </ResumeEntryHeading>
          <EntryDescription description={item.description} source={itemSources[index]} />
        </Box>
      )}
    </ResumeEntries>
  );
}

type EventEntriesProps = {
  items: {
    name: string;
    role?: string;
    talkTitle?: string;
    location?: string;
    period: string;
    url?: string;
  }[];
  itemSources: EditableSource[];
};

function EventEntries(props: EventEntriesProps) {
  return (
    <ResumeEntries items={props.items}>
      {(item, index) => (
        <ResumeEntryHeading
          key={`${item.name}-${item.period}`}
          item={item}
          source={props.itemSources[index]}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ gridColumn: { sm: '1 / -1' }, fontStyle: 'italic' }}
          >
            <Box component="span" {...getEditableProps(props.itemSources[index], 'role')}>
              {item.role}
            </Box>
            {item.talkTitle?.trim() && (
              <Box component="span" {...getEditableProps(props.itemSources[index], 'talkTitle')}>
                {' · '}
                {item.talkTitle}
              </Box>
            )}
            {item.location?.trim() && (
              <Box component="span" {...getEditableProps(props.itemSources[index], 'location')}>
                {' · '}
                {item.location}
              </Box>
            )}
          </Typography>
        </ResumeEntryHeading>
      )}
    </ResumeEntries>
  );
}

type AwardEntriesProps = {
  items: { name: string; issuer: string; description?: string; period: string; url?: string }[];
  itemSources: EditableSource[];
};

function AwardEntries(props: AwardEntriesProps) {
  const { items, itemSources } = props;
  return (
    <ResumeEntries items={items}>
      {(item, index) => (
        <Box key={`${item.name}-${item.period}`}>
          <ResumeEntryHeading item={item} source={itemSources[index]}>
            <Typography
              variant="body2"
              color="text.secondary"
              {...getEditableProps(itemSources[index], 'issuer')}
              sx={{ gridColumn: { sm: '1 / -1' }, fontStyle: 'italic' }}
            >
              {item.issuer}
            </Typography>
          </ResumeEntryHeading>
          <EntryDescription description={item.description} source={itemSources[index]} />
        </Box>
      )}
    </ResumeEntries>
  );
}

type ResumeCaseProps = { staticItem: CaseStudy };

function ResumeCase(props: ResumeCaseProps) {
  const { staticItem } = props;
  const t = useTranslations('Pages.resume');
  const { content: item, source } = useEditableContent(staticItem);

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
          columnGap: 3,
          rowGap: 0.25,
        }}
      >
        <LocaleLink
          href={`/cases/${item.slug}`}
          {...getEditableProps(source, 'title')}
          style={{ color: 'inherit', fontWeight: 700, textDecoration: 'none' }}
        >
          {item.title}
        </LocaleLink>
        <Typography variant="body2" color="text.secondary" {...getEditableProps(source, 'meta')}>
          {item.meta}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        {...getEditableProps(source, 'summary')}
        sx={{ mt: 0.75 }}
      >
        {item.summary}
      </Typography>
      <Typography variant="body2" {...getEditableProps(source, 'role')} sx={{ mt: 0.5 }}>
        {item.role}
      </Typography>
      <LocaleLink
        href={`/cases/${item.slug}`}
        style={{ display: 'inline-block', fontSize: '0.875rem', marginTop: '0.75rem' }}
      >
        {t('caseLink')}
      </LocaleLink>
    </Box>
  );
}

type ResumeCredentialsProps = {
  resume: ResumeContent['resume'];
  resumeSource: EditableSource;
  t: ReturnType<typeof useTranslations>;
};

function ResumeCredentials(props: ResumeCredentialsProps) {
  const { resume, resumeSource, t } = props;
  const credentialSections = [
    { key: 'certificates', title: t('certificates'), items: resume.certificates },
    { key: 'certifications', title: t('certifications'), items: resume.certifications },
    { key: 'publications', title: t('publications'), items: resume.publications },
  ] as const;
  return (
    <>
      {credentialSections
        .filter((section) => section.items.length > 0)
        .map((section) => (
          <ResumeSection key={section.key} title={section.title}>
            <CredentialEntries
              items={section.items}
              itemSources={sourceArray(resumeSource, section.key)}
            />
          </ResumeSection>
        ))}

      {resume.recommendations.length > 0 && (
        <ResumeSection title={t('recommendations')}>
          <RecommendationEntries
            items={resume.recommendations}
            itemSources={sourceArray(resumeSource, 'recommendations')}
          />
        </ResumeSection>
      )}

      {resume.technicalProductions.length > 0 && (
        <ResumeSection title={t('technicalProductions')}>
          <TechnicalProductionEntries
            items={resume.technicalProductions}
            itemSources={sourceArray(resumeSource, 'technicalProductions')}
          />
        </ResumeSection>
      )}

      {resume.events.length > 0 && (
        <ResumeSection title={t('events')}>
          <EventEntries items={resume.events} itemSources={sourceArray(resumeSource, 'events')} />
        </ResumeSection>
      )}

      {resume.awards.length > 0 && (
        <ResumeSection title={t('awards')}>
          <AwardEntries items={resume.awards} itemSources={sourceArray(resumeSource, 'awards')} />
        </ResumeSection>
      )}
    </>
  );
}

type ResumeHeaderProps = {
  page: ResumeContent['page'];
  pageSource: EditableSource;
  profile: ResumeContent['profile'];
  profileSource: EditableSource;
  profileRaw: EditableSource;
  site: ResumeContent['site'];
  contactSource: EditableSource;
  hasEmail: boolean;
  hasProfiles: boolean;
  locale: string;
  t: ReturnType<typeof useTranslations>;
  tExternalProfiles: ReturnType<typeof useTranslations>;
};

function ResumeHeader(props: ResumeHeaderProps) {
  const {
    page,
    pageSource,
    profile,
    profileSource,
    profileRaw,
    site,
    contactSource,
    hasEmail,
    hasProfiles,
    locale,
    t,
    tExternalProfiles,
  } = props;
  return (
    <Box component="header" sx={{ textAlign: 'center' }}>
      <Typography variant="overline" color="primary" {...getEditableProps(pageSource, 'title')}>
        {page.title}
      </Typography>
      <Typography
        component="h1"
        variant="h2"
        {...getEditableProps(profileRaw, 'name')}
        sx={{ fontWeight: 700, mt: 0.5 }}
      >
        {profile.name}
      </Typography>
      <Typography
        {...getEditableProps(profileSource, 'title')}
        sx={{ mt: 0.5, color: 'text.secondary' }}
      >
        {profile.title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        {...getEditableProps(profileSource, 'location')}
        sx={{ mt: 0.5 }}
      >
        {profile.location}
      </Typography>
      <Box sx={{ mt: 2, '@media print': { display: 'none' } }}>
        <ResumePdfActions locale={locale} t={t} />
      </Box>
      {(hasEmail || hasProfiles) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            columnGap: 2,
            rowGap: 0.5,
            mt: 2,
          }}
        >
          {hasEmail && (
            <ProtectedEmail
              challenge={site.contact.emailChallenge}
              label={t('email')}
              showAddress
              typographyVariant="body2"
            />
          )}
          {hasProfiles && (
            <Box {...getEditableProps(contactSource, 'profiles')} sx={{ display: 'contents' }}>
              {site.contact.profiles.map((profile) => (
                <ExternalLink key={profile.url} href={profile.url} variant="body2">
                  {externalProfileLabel(profile, tExternalProfiles)}
                </ExternalLink>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

type ResumeOverviewSectionsProps = {
  resume: ResumeContent['resume'];
  resumeSource: EditableSource;
  t: ReturnType<typeof useTranslations>;
};

function ResumeOverviewSections(props: ResumeOverviewSectionsProps) {
  const { resume, resumeSource, t } = props;
  return (
    <>
      {resume.summary?.trim() && (
        <ResumeSection title={t('profile')}>
          <Typography color="text.secondary" {...getEditableProps(resumeSource, 'summary')}>
            {resume.summary}
          </Typography>
        </ResumeSection>
      )}

      {resume.leadership.length > 0 && (
        <ResumeSection title={t('leadership')}>
          <TrajectoryEntries
            items={resume.leadership}
            itemSources={sourceArray(resumeSource, 'leadership')}
          />
        </ResumeSection>
      )}
    </>
  );
}

type ResumeExperienceItem = {
  item: ResumeContent['profile']['trajectory'][number];
  source: EditableSource;
};

type ResumeWorkSectionsProps = {
  cases: CaseStudy[];
  experience: ResumeExperienceItem[];
  t: ReturnType<typeof useTranslations>;
};

function ResumeWorkSections(props: ResumeWorkSectionsProps) {
  const { cases, experience, t } = props;
  return (
    <>
      {experience.length > 0 && (
        <ResumeSection title={t('experience')}>
          <TrajectoryEntries
            items={experience.map((entry) => entry.item)}
            itemSources={experience.map((entry) => entry.source)}
          />
        </ResumeSection>
      )}

      {cases.length > 0 && (
        <ResumeSection title={t('selectedWork')}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            {cases.map((item) => (
              <ResumeCase key={item.slug} staticItem={item} />
            ))}
          </Box>
        </ResumeSection>
      )}
    </>
  );
}

type ResumeQualificationSectionsProps = {
  resume: ResumeContent['resume'];
  resumeSource: EditableSource;
  t: ReturnType<typeof useTranslations>;
};

function ResumeQualificationSections(props: ResumeQualificationSectionsProps) {
  const { resume, resumeSource, t } = props;
  const skillSources = sourceArray(resumeSource, 'skills');
  return (
    <>
      {resume.skills.length > 0 && (
        <ResumeSection title={t('skills')}>
          <Box sx={{ display: 'grid', gap: 1.25 }}>
            {resume.skills.map((group, index) => (
              <Typography
                key={`${group.label || 'skill'}-${(group.items ?? []).join(',')}`}
                variant="body2"
                color="text.secondary"
                {...getEditableProps(skillSources[index])}
              >
                <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
                  {group.label}:{' '}
                </Box>
                {(group.items ?? []).join(' · ')}
              </Typography>
            ))}
          </Box>
        </ResumeSection>
      )}

      {resume.education.length > 0 && (
        <ResumeSection title={t('education')}>
          <EducationEntries
            items={resume.education}
            itemSources={sourceArray(resumeSource, 'education')}
          />
        </ResumeSection>
      )}
    </>
  );
}

type ResumePageContentProps = { content: ResumeContent };

export function ResumePageContent(props: ResumePageContentProps) {
  const { content: staticContent } = props;
  const t = useTranslations('Pages.resume');
  const tNav = useTranslations('Nav');
  const tExternalProfiles = useTranslations('ExternalProfiles');
  const locale = useLocale();
  const { content: page, source: pageSource } = useEditableContent(staticContent.page);
  const {
    content: profile,
    source: profileSource,
    raw: profileRaw,
  } = useEditableContent(staticContent.profile);
  const { content: resume, source: resumeSource } = useEditableContent(staticContent.resume);
  const { content: site, raw: siteSource } = useEditableContent(staticContent.site);
  const contactSource = contactSourceFrom(siteSource);
  const hasEmail = site.contact.hasEmail;
  const hasProfiles = site.contact.profiles.length > 0;
  const trajectorySources = sourceArray(profileSource, 'trajectory');
  const resumeExperience = profile.trajectory
    .map((item, index) => ({ item, source: trajectorySources[index] }))
    .filter((props) => {
      const { item } = props;
      return item.includeInResume;
    });

  return (
    <Box
      component="article"
      sx={{
        maxWidth: '52rem',
        mx: 'auto',
        py: { xs: 6, md: 8 },
        '@media print': { maxWidth: 'none', py: 0 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', '@media print': { display: 'none' } }}>
        <Breadcrumbs trail={[{ label: tNav('resume') }]} />
      </Box>
      <ResumeHeader
        page={page}
        pageSource={pageSource}
        profile={profile}
        profileSource={profileSource}
        profileRaw={profileRaw}
        site={site}
        contactSource={contactSource}
        hasEmail={hasEmail}
        hasProfiles={hasProfiles}
        locale={locale}
        t={t}
        tExternalProfiles={tExternalProfiles}
      />

      <ResumeOverviewSections resume={resume} resumeSource={resumeSource} t={t} />
      <ResumeWorkSections cases={staticContent.cases} experience={resumeExperience} t={t} />
      <ResumeQualificationSections resume={resume} resumeSource={resumeSource} t={t} />
      <ResumeCredentials resume={resume} resumeSource={resumeSource} t={t} />
    </Box>
  );
}
