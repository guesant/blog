import { SvgElement } from '../../ui';
import type { Translator } from '@/i18n/compat-support';
import { QueueRow } from './queue-row';
import type { IllustrationAccent } from './types';

export type QueueIllustrationProps = {
  accent: IllustrationAccent;
  t: Translator;
};

export function QueueIllustration(props: QueueIllustrationProps) {
  return (
    <>
      <SvgElement
        component="rect"
        x="30"
        y="32"
        width="340"
        height="236"
        rx="14"
        fill="#fff"
        stroke={props.accent.line}
      />
      <SvgElement component="line" x1="30" y1="72" x2="370" y2="72" stroke={props.accent.line} />
      <SvgElement
        component="rect"
        x="44"
        y="96"
        width="312"
        height="30"
        rx="6"
        fill={`${props.accent.strong}18`}
        stroke={props.accent.line}
      />
      {[0, 1, 2, 3].map((index) => (
        <QueueRow key={index} index={index} accent={props.accent} />
      ))}
    </>
  );
}
