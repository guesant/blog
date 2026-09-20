'use client';

import { Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { ResumeOverviewSectionsProps } from './types';
import { ResumeSection } from './resume-section';
import { TrajectoryEntries } from './trajectory-entries';

export function ResumeOverviewSections(props: ResumeOverviewSectionsProps) {
  const { resume, t } = props;

  return (
    <>
      <ConditionalContent
        condition={Boolean(resume.summary?.trim())}
        content={
          <ResumeSection
            title={t('profile')}
            children={<Typography color="text.secondary">{resume.summary}</Typography>}
          />
        }
      />

      <ConditionalContent
        condition={resume.leadership.length > 0}
        content={
          <ResumeSection
            title={t('leadership')}
            children={<TrajectoryEntries items={resume.leadership} />}
          />
        }
      />
    </>
  );
}
