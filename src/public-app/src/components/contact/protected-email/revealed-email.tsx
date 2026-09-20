'use client';

import type { RevealedEmailProps } from './types';
import { RevealedEmailButton } from './revealed-email-button';
import { RevealedEmailInline } from './revealed-email-inline';
import { RevealedEmailSidebar } from './revealed-email-sidebar';
import { ConditionalContent } from '../../primitives/conditional-content';

export function RevealedEmail(props: RevealedEmailProps) {
  return (
    <>
      <ConditionalContent condition={props.variant === 'button'}>
        <RevealedEmailButton {...props} />
      </ConditionalContent>
      <ConditionalContent condition={props.variant === 'sidebar'}>
        <RevealedEmailSidebar {...props} />
      </ConditionalContent>
      <ConditionalContent condition={props.variant === 'inline'}>
        <RevealedEmailInline {...props} />
      </ConditionalContent>
    </>
  );
}
