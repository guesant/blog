import * as motion from 'motion/react-m';
import type { ComponentProps } from 'react';
import { motionDivVariants } from './variants';

type MotionDivProps = ComponentProps<typeof motion.div> & { visualVariant?: string };

export function MotionDiv(props: MotionDivProps) {
  const { visualVariant, style, ...motionProps } = props;

  const visualStyle = motionDivVariants[visualVariant ?? ''];

  return <motion.div {...motionProps} style={{ ...visualStyle, ...(style as object) }} />;
}
