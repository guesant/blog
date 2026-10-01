import type { ComponentProps } from 'react';
import { Stack } from '../stack';

type FindingTopicsListFrameProps = ComponentProps<typeof Stack>;

export function FindingTopicsListFrame(props: FindingTopicsListFrameProps) {
  return <Stack {...props} sx={{ flexWrap: 'wrap', gap: 'var(--site-space-2)', ...props.sx }} />;
}
