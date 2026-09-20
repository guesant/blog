'use client';

import { Box } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { ResumeWorkSectionsProps } from './types';
import { ResumeSection } from './resume-section';
import { TrajectoryEntries } from './trajectory-entries';
import { ResumeCase } from './resume-case';

export function ResumeWorkSections(props: ResumeWorkSectionsProps) {
  const { cases, experience, t } = props;

  return (
    <>
      <ConditionalContent
        condition={experience.length > 0}
        content={
          <ResumeSection
            title={t('experience')}
            children={<TrajectoryEntries items={experience.map((entry) => entry.item)} />}
          />
        }
      />

      <ConditionalContent
        condition={cases.length > 0}
        content={
          <ResumeSection
            title={t('selectedWork')}
            children={
              <Box visualVariant="resumeWorkSections">
                {cases.map((item) => (
                  <ResumeCase key={item.slug} staticItem={item} />
                ))}
              </Box>
            }
          />
        }
      />
    </>
  );
}
