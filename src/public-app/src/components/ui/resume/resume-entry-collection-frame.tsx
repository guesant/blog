import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeEntryCollectionFrameProps = { children: ReactNode };

const collectionStyles = { display: 'grid', gap: 2 };

export function ResumeEntryCollectionFrame(props: ResumeEntryCollectionFrameProps) {
  return <Box sx={collectionStyles}>{props.children}</Box>;
}
