import { SvgElement } from '../../ui';
import type { IllustrationAccent } from './types';
import type { Translator } from '@/i18n/compat-support';

type ArchitectureApplicationProps = {
  accent: IllustrationAccent;
  t: Translator;
};

export function ArchitectureApplication(props: ArchitectureApplicationProps) {
  return (
    <>
      <SvgElement
        component="line"
        x1="200"
        y1="92"
        x2="200"
        y2="120"
        stroke={props.accent.line}
        strokeWidth="1.5"
      />
      <SvgElement
        component="rect"
        x="120"
        y="48"
        width="160"
        height="44"
        rx="10"
        fill="#fff"
        stroke={props.accent.line}
      />
      <SvgElement
        component="text"
        x="200"
        y="75"
        fontSize="13"
        textAnchor="middle"
        fill={props.accent.strong}
      >
        {props.t('application')}
      </SvgElement>
    </>
  );
}
