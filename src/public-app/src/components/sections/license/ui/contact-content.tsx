import { InlineProtectedEmail } from '../../../contact/protected-email';
import { ConditionalContent } from '../../../primitives/conditional-content';
import { Typography } from '../../../ui';
import type { ProtectedEmailChallenge } from '@portfolio/data/domain/protected-email';
import { LicenseContact } from './contact';

type LicenseContactContentProps = {
  contact?: string;
  emailChallenge?: ProtectedEmailChallenge;
  revealLabel: string;
};

export function LicenseContactContent(props: LicenseContactContentProps) {
  return (
    <ConditionalContent
      condition={Boolean(props.emailChallenge)}
      content={
        <LicenseContact>
          <Typography color="text.secondary">{props.contact}</Typography>
          <InlineProtectedEmail
            challenge={props.emailChallenge}
            label={props.revealLabel}
            showAddress
          />
        </LicenseContact>
      }
    />
  );
}
