import type { ComponentProps } from 'react';
import { mergeSx } from '@/components/ui/sx';
import { CaseIllustrationFrame } from './CaseIllustrationFrame';

type CaseIllustrationCompactFrameProps = ComponentProps<typeof CaseIllustrationFrame>;

export function CaseIllustrationCompactFrame(props: CaseIllustrationCompactFrameProps) {
  return (
    <CaseIllustrationFrame
      {...props}
      sx={mergeSx({ p: { xs: 1.5, md: 2 }, aspectRatio: '16 / 9' }, props.sx)}
    />
  );
}
