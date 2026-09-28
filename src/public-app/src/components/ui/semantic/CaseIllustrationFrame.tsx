import type { ComponentProps } from 'react';
import { Box } from '../box';
import type { IllustrationAccent } from '../../content/case-illustration/types';

export type CaseIllustrationFrameProps = ComponentProps<typeof Box> & {
  accent: IllustrationAccent;
};

export function CaseIllustrationFrame(props: CaseIllustrationFrameProps) {
  const { accent, sx, ...boxProps } = props;

  return (
    <Box
      {...boxProps}
      sx={[
        {
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          borderRadius: 0,
          bgcolor: accent.bg,
          border: 1,
          borderColor: `${accent.line}66`,
        },
        sx ?? {},
      ]}
    />
  );
}
