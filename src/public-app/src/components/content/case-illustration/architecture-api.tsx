import { SvgElement } from '../../ui';
import type { IllustrationAccent } from './types';
import type { Translator } from '@/i18n/compat-support';

type ArchitectureApiProps = {
  accent: IllustrationAccent;
  t: Translator;
};

export function ArchitectureApi(props: ArchitectureApiProps) {
  return (
    <>
      <SvgElement
        component="line"
        x1="200"
        y1="184"
        x2="200"
        y2="206"
        stroke={props.accent.line}
        strokeWidth="1.5"
      />
      <SvgElement
        component="rect"
        x="96"
        y="120"
        width="208"
        height="64"
        rx="10"
        fill={`${props.accent.strong}18`}
        stroke={props.accent.line}
      />
      <SvgElement
        component="text"
        x="200"
        y="140"
        fontSize="12"
        textAnchor="middle"
        fill={props.accent.strong}
      >
        {props.t('api')}
      </SvgElement>
    </>
  );
}
