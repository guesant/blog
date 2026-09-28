import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ResumeEntryTitleExternal } from './resume-entry-title-external';
import { ResumeEntryTitlePlain } from './resume-entry-title-plain';

type ResumeEntryTitleProps = {
  children: ReactNode;
  href?: string;
};

export function ResumeEntryTitle(props: ResumeEntryTitleProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.href?.trim())}
        content={<ResumeEntryTitleExternal href={props.href ?? ''} children={props.children} />}
      />
      <ConditionalContent
        condition={!props.href?.trim()}
        content={<ResumeEntryTitlePlain children={props.children} />}
      />
    </>
  );
}
