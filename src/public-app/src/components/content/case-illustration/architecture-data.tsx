import { SvgElement } from '../../ui';
import type { IllustrationAccent } from './types';
import type { Translator } from '@/i18n/compat-support';

type ArchitectureDataProps = {
  accent: IllustrationAccent;
  t: Translator;
};

export function ArchitectureData(props: ArchitectureDataProps) {
  return (
    <>
      <SvgElement
        component="ellipse"
        cx="200"
        cy="216"
        rx="52"
        ry="12"
        fill={`${props.accent.strong}18`}
        stroke={props.accent.line}
      />
      <SvgElement
        component="path"
        d="M148 216v36a52 12 0 0 0 104 0v-36"
        fill="none"
        stroke={props.accent.line}
      />
      <SvgElement
        component="text"
        x="200"
        y="238"
        fontSize="12"
        textAnchor="middle"
        fill={props.accent.strong}
      >
        {props.t('data')}
      </SvgElement>
    </>
  );
}
