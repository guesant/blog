'use client';

import {
  ResumeEducationDegree,
  ResumeEducationEntryFrame,
  ResumeEntryTitle,
  Typography,
} from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { EducationItem } from './types';
import { EntryPeriod } from './entry-period';

type EducationEntryProps = { item: EducationItem };

export function EducationEntry(props: EducationEntryProps) {
  const { item } = props;

  return (
    <ResumeEducationEntryFrame>
      <ResumeEntryTitle>{item.institution}</ResumeEntryTitle>
      <EntryPeriod period={item.period} />
      <ResumeEducationDegree>{item.degree}</ResumeEducationDegree>
      <ConditionalContent
        condition={Boolean(item.location)}
        content={
          <Typography variant="body2" color="text.secondary">
            {item.location}
          </Typography>
        }
      />
    </ResumeEducationEntryFrame>
  );
}
