import type { ComponentProps } from 'react';
import { PageLayoutFrame } from './PageLayoutFrame';

type AboutPageLayoutFrameProps = ComponentProps<typeof PageLayoutFrame>;

export function AboutPageLayoutFrame(props: AboutPageLayoutFrameProps) {
  return <PageLayoutFrame {...props} />;
}
