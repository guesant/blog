'use client';

import { ResumeHighlightItem } from '../../ui';

type HighlightItemProps = { highlight: string };

export function HighlightItem(props: HighlightItemProps) {
  return <ResumeHighlightItem highlight={props.highlight} />;
}
