import { EmptyState } from '../../content/empty-state';
import type { ContactPageContentProps } from './types';
import type { useTranslations } from '@/i18n/compat';
import { ContactDetails } from './contact-details';
import { ConditionalContent } from '../../primitives/conditional-content';

type ContactPageBodyProps = {
  page: ContactPageContentProps['page'];
  site: ContactPageContentProps['site'];
  t: ReturnType<typeof useTranslations>;
  tCommon: ReturnType<typeof useTranslations>;
  tExternalProfiles: ReturnType<typeof useTranslations>;
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
            page={props.page}
            site={props.site}
            hasEmail={hasEmail}
            t={props.t}
            tCommon={props.tCommon}
            tExternalProfiles={props.tExternalProfiles}
          />
        }
      />
    </>
  );
}
