import { SvgElement } from '../../ui';
import type { QueueRowProps } from './types';

export function QueueRow(props: QueueRowProps) {
  const { index, accent } = props;

  const primary = index === 0;

  return (
    <SvgElement component="g">
      <SvgElement
        component="circle"
        cx="66"
        cy={141 + index * 30}
        r="8"
        fill="none"
        stroke={accent.line}
      />
      <SvgElement
        component="rect"
        x="84"
        y={135 + index * 30}
        width={primary ? 130 : 96}
        height="5"
        rx="2.5"
        fill={primary ? accent.strong : accent.line}
        opacity={primary ? 0.85 : 0.5}
      />
    </SvgElement>
  );
}
