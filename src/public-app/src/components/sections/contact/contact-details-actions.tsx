import { ProtectedEmail } from '../../contact/protected-email';
import { ContactProfileGrid } from '../../contact/contact-profile-grid';
import { ConditionalContent } from '../../primitives/conditional-content';
import { Box } from '../../ui';
import type { ContactDetailsProps } from './types';

type ContactDetailsActionsProps = Pick<
  ContactDetailsProps,
  'hasEmail' | 'site' | 't' | 'tExternalProfiles'
>;

export function ContactDetailsActions(props: ContactDetailsActionsProps) {
  return (
    <>
      <ConditionalContent
        condition={props.hasEmail}
        content={
          <Box>
            <ProtectedEmail
              challenge={props.site.contact.emailChallenge}
              available={props.hasEmail}
              label={props.t('email')}
              variant="button"
            />
          </Box>
        }
      />
      <ConditionalContent
        condition={props.site.contact.profiles.length > 0}
        content={
          <Box>
            <ContactProfileGrid
              profiles={props.site.contact.profiles}
              tExternalProfiles={props.tExternalProfiles}
            />
          </Box>
        }
      />
    </>
  );
}
