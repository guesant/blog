import type { ComponentProps } from 'react';
import { Stack } from '../stack';

type AchadoTopicsListFrameProps = ComponentProps<typeof Stack>;

export function AchadoTopicsListFrame(props: AchadoTopicsListFrameProps) {
  return <Stack {...props} sx={{ flexWrap: 'wrap', gap: 'var(--site-space-2)', ...props.sx }} />;
}
