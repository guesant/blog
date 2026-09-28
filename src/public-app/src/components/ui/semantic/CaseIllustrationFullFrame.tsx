import type { ComponentProps } from 'react';
import { mergeSx } from '@/components/ui/sx';
import { CaseIllustrationFrame } from './CaseIllustrationFrame';

type CaseIllustrationFullFrameProps = ComponentProps<typeof CaseIllustrationFrame>;

export function CaseIllustrationFullFrame(props: CaseIllustrationFullFrameProps) {
  return (
    <CaseIllustrationFrame
      {...props}
      sx={mergeSx({ p: { xs: 2, md: 4 }, aspectRatio: '4 / 3' }, props.sx)}
    />
  );
}
