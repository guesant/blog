import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ResumeSection } from './resume-section';

type ResumeCredentialSectionProps = {
  condition: boolean;
  entries: ReactNode;
  title: string;
};

export function ResumeCredentialSection(props: ResumeCredentialSectionProps) {
  return (
    <ConditionalContent
      condition={props.condition}
      content={<ResumeSection title={props.title} children={props.entries} />}
    />
  );
}
