import { ProtectedEmail } from '../../contact/protected-email';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { SiteText } from '@portfolio/data/domain/types';

type HomeContactEmailProps = {
  site: SiteText;
  hasEmail: boolean;
  label: string;
};

export function HomeContactEmail(props: HomeContactEmailProps) {
  return (
    <ConditionalContent
      condition={props.hasEmail}
      content={
        <ProtectedEmail
          challenge={props.site.contact.emailChallenge}
          available={props.hasEmail}
          label={props.label}
          variant="button"
          buttonSiteVariant="exploration"
          visualVariant="fullWidth"
        />
      }
    />
  );
}
