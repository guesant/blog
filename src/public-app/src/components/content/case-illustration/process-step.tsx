import { SvgElement } from '../../ui';
import type { IllustrationAccent } from './types';

type ProcessStepProps = { index: number; accent: IllustrationAccent };

export function ProcessStep(props: ProcessStepProps) {
  const { index, accent } = props;

  return (
    <SvgElement component="g">
      <SvgElement
        component="circle"
        cx={70 + index * 88}
        cy="108"
        r="20"
        fill="#fff"
        stroke={accent.line}
      />
      <SvgElement
        component="text"
        x={70 + index * 88}
        y="113"
        fontSize="14"
        textAnchor="middle"
        fill={accent.strong}
      >
        {index + 1}
      </SvgElement>
    </SvgElement>
  );
}
