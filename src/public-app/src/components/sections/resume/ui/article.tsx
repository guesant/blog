import type { ReactNode } from 'react';
import { ResumeArticleFrame } from '../../../ui';

type ResumeArticleProps = {
  children: ReactNode;
};

export function ResumeArticle(props: ResumeArticleProps) {
  return <ResumeArticleFrame>{props.children}</ResumeArticleFrame>;
}
