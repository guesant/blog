import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type ResumeArticleProps = {
  children: ReactNode;
};

export function ResumeArticle(props: ResumeArticleProps) {
  return (
    <Box component="article" visualVariant="resumeArticle">
      {props.children}
    </Box>
  );
}
