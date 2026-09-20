'use client';

import type { RevealTriggerProps } from './types';
import { RevealTriggerButton } from './reveal-trigger-button';
import { RevealTriggerInline } from './reveal-trigger-inline';
import { RevealTriggerSidebar } from './reveal-trigger-sidebar';
import { ConditionalContent } from '../../primitives/conditional-content';

export function RevealTrigger(props: RevealTriggerProps) {
  return (
    <>
      <ConditionalContent condition={props.variant === 'button'}>
        <RevealTriggerButton {...props} />
      </ConditionalContent>
      <ConditionalContent condition={props.variant === 'sidebar'}>
        <RevealTriggerSidebar {...props} />
      </ConditionalContent>
      <ConditionalContent condition={props.variant === 'inline'}>
        <RevealTriggerInline {...props} />
      </ConditionalContent>
    </>
  );
}
