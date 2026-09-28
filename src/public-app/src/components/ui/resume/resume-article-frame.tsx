import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeArticleFrameProps = { children: ReactNode };

const articleStyles = {
  '@media print': { maxWidth: 'none', paddingBlock: 0 },
};

export function ResumeArticleFrame(props: ResumeArticleFrameProps) {
  return (
    <Box component="article" sx={articleStyles}>
      {props.children}
    </Box>
  );
}
