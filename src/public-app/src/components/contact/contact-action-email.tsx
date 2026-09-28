import type { SiteText } from '@portfolio/data/domain/types';
import { ContactProtectedEmail } from './protected-email';

type ContactActionEmailProps = {
  site: SiteText;
  hasEmail: boolean;
  label: string;
};

export function ContactActionEmail(props: ContactActionEmailProps) {
  if (!props.hasEmail) {
    return null;
  }

  return (
    <ContactProtectedEmail
      challenge={props.site.contact.emailChallenge}
      available={props.hasEmail}
      label={props.label}
    />
  );
}
