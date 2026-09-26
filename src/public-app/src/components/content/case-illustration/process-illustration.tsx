import { SvgElement } from '../../ui';
import type { IllustrationTranslator } from '@/i18n/compat-support';
import { ProcessStep } from './process-step';
import type { IllustrationAccent } from './types';

export type ProcessIllustrationProps = {
  accent: IllustrationAccent;
  t: IllustrationTranslator;
};

export function ProcessIllustration(props: ProcessIllustrationProps) {
  return (
    <>
      <SvgElement
        component="line"
        x1="70"
        y1="108"
        x2="300"
        y2="108"
        stroke={props.accent.line}
        strokeWidth="1.5"
      />
      {[0, 1, 2].map((index) => (
        <ProcessStep key={index} index={index} accent={props.accent} />
      ))}
      <SvgElement
        component="path"
        d="M300 82h44l16 16v64h-60z"
        fill="#fff"
        stroke={props.accent.line}
      />
      <SvgElement component="path" d="M344 82v16h16" fill="none" stroke={props.accent.line} />
      <SvgElement
        component="path"
        d="m314 148 8 8 16-18"
        fill="none"
        stroke={props.accent.strong}
        strokeWidth="2.5"
      />
    </>
  );
}
