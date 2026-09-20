import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type SnippetFileListProps = {
  children: ReactNode;
};

export function SnippetFileList(props: SnippetFileListProps) {
  return <Box sx={{ display: 'grid', gap: 'var(--site-space-4)' }}>{props.children}</Box>;
}
