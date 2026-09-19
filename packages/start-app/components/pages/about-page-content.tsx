'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ContentRichText, getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { AboutPageCopy, Profile } from '@portfolio/content/types';
import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../content/page-header';
import { TimelineRow } from '../content/timeline-row';

function calculateAge(birthDateISO: string): number | undefined {
  const birthDate = new Date(birthDateISO);
  if (Number.isNaN(birthDate.getTime())) {
    return undefined;
  }
  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const hasHadBirthdayThisYear =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());
  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }
  return age;
}

function getProfileBirthInfo(profile: Profile) {
  const age = profile.birthDate?.trim() ? calculateAge(profile.birthDate) : undefined;
  return { age, hasBirthInfo: age !== undefined || Boolean(profile.birthCity?.trim()) };
}

type AboutPageContentProps = {
  page: AboutPageCopy;
  profile: Profile;
};

type ProfileSummaryProps = {
  profile: Profile;
  profileSource: Record<string, unknown>;
  profileRaw: Record<string, unknown>;
  age: number | undefined;
  hasBirthInfo: boolean;
  t: ReturnType<typeof useTranslations>;
};

type ProfileBirthDetailsProps = Pick<
  ProfileSummaryProps,
  'profile' | 'profileSource' | 'profileRaw' | 'age' | 'hasBirthInfo' | 't'
>;

function ProfileBirthDetails(props: ProfileBirthDetailsProps) {
  const { profile, profileSource, profileRaw, age, hasBirthInfo, t } = props;
  if (!hasBirthInfo) {
    return null;
  }
  const hasAge = age !== undefined;
  const hasBirthCity = Boolean(profile.birthCity?.trim());
  return (
    <Typography color="text.secondary" sx={{ mt: 0.25, fontSize: '.875rem' }}>
      {hasAge && (
        <Box component="span" {...getEditableProps(profileRaw, 'birthDate')}>
          {t('age', { age })}
        </Box>
      )}
      {hasAge && hasBirthCity ? ' · ' : null}
      {hasBirthCity && (
        <Box component="span" {...getEditableProps(profileSource, 'birthCity')}>
          {profile.birthCity}
        </Box>
      )}
    </Typography>
  );
}

function ProfileSummary(props: ProfileSummaryProps) {
  const { profile, profileSource, profileRaw, age, hasBirthInfo, t } = props;
  return (
    <Paper variant="outlined" sx={{ p: 3, bgcolor: 'rgba(255,255,255,.45)' }}>
      <Typography
        variant="overline"
        color="text.secondary"
        {...getEditableProps(profileRaw, 'name')}
      >
        {profile.name}
      </Typography>
      <Typography
        variant="h3"
        {...getEditableProps(profileSource, 'title')}
        sx={{ mt: 1.5, fontSize: '1.25rem' }}
      >
        {profile.title}
      </Typography>
      <Typography
        color="text.secondary"
        {...getEditableProps(profileSource, 'location')}
        sx={{ mt: 0.75, fontSize: '.875rem' }}
      >
        {profile.location}
      </Typography>
      <ProfileBirthDetails
        profile={profile}
        profileSource={profileSource}
        profileRaw={profileRaw}
        age={age}
        hasBirthInfo={hasBirthInfo}
        t={t}
      />
      {[
        [t('interests'), profile.interests, 'interests'],
        [t('learning'), profile.learning, 'learning'],
      ].map(([title, text, field]) => (
        <Box key={title} sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
          <Typography
            color="text.secondary"
            {...getEditableProps(profileSource, field)}
            sx={{ mt: 1, fontSize: '.875rem' }}
          >
            {text}
          </Typography>
        </Box>
      ))}
      {profile.personalInterests.length > 0 && (
        <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="overline" color="text.secondary">
            {t('personalInterests')}
          </Typography>
          <Box
            component="ul"
            {...getEditableProps(profileSource, 'personalInterests')}
            sx={{ color: 'text.secondary', my: 1, pl: 2.5, fontSize: '.875rem' }}
          >
            {profile.personalInterests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}

type ProfileTrajectoryProps = {
  profile: Profile;
  profileSource: Record<string, unknown>;
  t: ReturnType<typeof useTranslations>;
};

function ProfileTrajectory(props: ProfileTrajectoryProps) {
  const { profile, profileSource, t } = props;
  if (profile.trajectory.length === 0) {
    return null;
  }
  const trajectorySources = Array.isArray(profileSource.trajectory)
    ? (profileSource.trajectory as Record<string, unknown>[])
    : [];

  return (
    <Box sx={{ mt: { xs: 8, md: 10 } }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        {t('trajectory')}
      </Typography>
      {profile.trajectory.map((item, index) => {
        const itemSource = trajectorySources[index];
        return (
          <TimelineRow
            key={`${item.organization}-${item.period}`}
            rail={item.period}
            title={item.role}
            subtitle={item.organization}
            body={(item.highlights ?? []).join(' ')}
            railEditableProps={getEditableProps(itemSource, 'period')}
            titleEditableProps={getEditableProps(itemSource, 'role')}
            subtitleEditableProps={getEditableProps(itemSource, 'organization')}
            bodyEditableProps={getEditableProps(itemSource, 'highlights')}
          />
        );
      })}
    </Box>
  );
}

type ProfileMilestonesProps = {
  profile: Profile;
  profileSource: Record<string, unknown>;
  t: ReturnType<typeof useTranslations>;
};

function ProfileMilestones(props: ProfileMilestonesProps) {
  const { profile, profileSource, t } = props;
  const milestones = profile.milestones ?? [];
  if (milestones.length === 0) {
    return null;
  }
  const milestoneSources = Array.isArray(profileSource.milestones)
    ? (profileSource.milestones as Record<string, unknown>[])
    : [];

  return (
    <Box sx={{ mt: { xs: 8, md: 10 } }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        {t('milestones')}
      </Typography>
      {milestones.map((item, index) => {
        const itemSource = milestoneSources[index];
        return (
          <TimelineRow
            key={`${item.year}-${item.title}`}
            rail={item.year}
            title={item.title}
            body={item.description}
            railEditableProps={getEditableProps(itemSource, 'year')}
            titleEditableProps={getEditableProps(itemSource, 'title')}
            bodyEditableProps={getEditableProps(itemSource, 'description')}
          />
        );
      })}
    </Box>
  );
}

type AboutStoryProps = {
  page: AboutPageCopy;
  pageSource: Record<string, unknown>;
};

function AboutStory(props: AboutStoryProps) {
  const { page, pageSource } = props;
  if (!page.story) {
    return null;
  }

  return (
    <Box sx={{ mt: { xs: 8, md: 10 }, maxWidth: '68ch' }}>
      {page.storyEyebrow ? (
        <Typography
          variant="overline"
          color="text.secondary"
          {...getEditableProps(pageSource, 'storyEyebrow')}
          sx={{ display: 'block' }}
        >
          {page.storyEyebrow}
        </Typography>
      ) : null}
      {page.storyTitle ? (
        <Typography
          variant="h2"
          {...getEditableProps(pageSource, 'storyTitle')}
          sx={{ mt: 1, fontSize: { xs: '1.5rem', md: '1.75rem' } }}
        >
          {page.storyTitle}
        </Typography>
      ) : null}
      <Box
        {...getEditableProps(pageSource, 'story')}
        sx={{ mt: 3, color: 'text.secondary', '& p': { mt: 0, mb: 2 } }}
      >
        <ContentRichText content={page.story} />
      </Box>
    </Box>
  );
}

export function AboutPageContent(props: AboutPageContentProps) {
  const { page: staticPage, profile: staticProfile } = props;
  const t = useTranslations('Pages.about');
  const tNav = useTranslations('Nav');
  const { content: page, source: pageSource } = useEditableContent(staticPage);
  const {
    content: profile,
    source: profileSource,
    raw: profileRaw,
  } = useEditableContent(staticProfile);
  const { age, hasBirthInfo } = getProfileBirthInfo(profile);

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        editableProps={{
          eyebrow: getEditableProps(pageSource, 'eyebrow'),
          title: getEditableProps(pageSource, 'title'),
        }}
        breadcrumbs={[{ label: tNav('about') }]}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
          gap: { xs: 5, md: 8 },
          alignItems: 'start',
        }}
      >
        <Box>
          <Typography
            variant="h2"
            {...getEditableProps(pageSource, 'lead')}
            sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' }, maxWidth: '30ch' }}
          >
            {page.lead}
          </Typography>
          <Typography {...getEditableProps(pageSource, 'context')} sx={{ mt: 3, maxWidth: '62ch' }}>
            {page.context}
          </Typography>
          <Typography
            color="text.secondary"
            {...getEditableProps(pageSource, 'description')}
            sx={{ mt: 2.5, maxWidth: '62ch' }}
          >
            {page.description}
          </Typography>
        </Box>

        <ProfileSummary
          profile={profile}
          profileSource={profileSource}
          profileRaw={profileRaw}
          age={age}
          hasBirthInfo={hasBirthInfo}
          t={t}
        />
      </Box>

      <AboutStory page={page} pageSource={pageSource} />

      <ProfileTrajectory profile={profile} profileSource={profileSource} t={t} />

      <ProfileMilestones profile={profile} profileSource={profileSource} t={t} />
    </>
  );
}
