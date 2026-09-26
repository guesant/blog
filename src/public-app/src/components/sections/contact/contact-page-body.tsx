import { EmptyState } from '../../content/empty-state';
import type { ContactPageContentProps } from './types';
import type {
  CommonTranslator,
  ContactTranslator,
  ExternalProfilesTranslator,
} from '@/i18n/compat-support';
import { ContactDetails } from './contact-details';
import { ConditionalContent } from '../../primitives/conditional-content';

type ContactPageBodyProps = {
  site: ContactPageContentProps['site'];
  t: ContactTranslator;
  tCommon: CommonTranslator;
  tExternalProfiles: ExternalProfilesTranslator;
};

export function ContactPageBody(props: ContactPageBodyProps) {
  const hasEmail = props.site.contact.hasEmail;

  const hasProfiles = props.site.contact.profiles.length > 0;

  const hasContact = hasEmail || hasProfiles;

  return (
    <>
      <ConditionalContent
        condition={!hasContact}
        content={<EmptyState icon="problem">{props.tCommon('emptyContact')}</EmptyState>}
      />
      <ConditionalContent
        condition={hasContact}
        content={
          <ContactDetails
            site={props.site}
            hasEmail={hasEmail}
            t={props.t}
            tExternalProfiles={props.tExternalProfiles}
          />
        }
      />
    </>
  );
}
