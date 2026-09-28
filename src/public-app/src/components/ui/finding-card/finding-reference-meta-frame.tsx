import type { ReactNode } from 'react';
import { Box } from '../box';

type FindingReferenceMetaFrameProps = { children: ReactNode };

const metaStyles = { display: 'flex', alignItems: 'center', gap: 1 };

export function FindingReferenceMetaFrame(props: FindingReferenceMetaFrameProps) {
  return <Box sx={metaStyles}>{props.children}</Box>;
}
