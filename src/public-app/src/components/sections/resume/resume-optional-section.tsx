import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';

type ResumeOptionalSectionProps = {
  condition: boolean;
  content: ReactNode;
};

export function ResumeOptionalSection(props: ResumeOptionalSectionProps) {
  return <ConditionalContent condition={props.condition} content={props.content} />;
}
