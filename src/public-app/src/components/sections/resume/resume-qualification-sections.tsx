'use client';

import { ResumeQualificationListFrame } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { ResumeQualificationSectionsProps } from './types';
import { ResumeSection } from './resume-section';
import { EducationEntries } from './education-entries';
import { ResumeSkill } from './resume-skill';

export function ResumeQualificationSections(props: ResumeQualificationSectionsProps) {
  const { resume, t } = props;

  return (
    <>
      <ConditionalContent
        condition={resume.skills.length > 0}
        content={
          <ResumeSection
            title={t('skills')}
            children={
              <ResumeQualificationListFrame>
                {resume.skills.map((group) => (
                  <ResumeSkill
                    key={`${group.label || 'skill'}-${(group.items ?? []).join(',')}`}
                    group={group}
                  />
                ))}
              </ResumeQualificationListFrame>
            }
          />
        }
      />

      <ConditionalContent
        condition={resume.education.length > 0}
        content={
          <ResumeSection
            title={t('education')}
            children={<EducationEntries items={resume.education} />}
          />
        }
      />
    </>
  );
}
