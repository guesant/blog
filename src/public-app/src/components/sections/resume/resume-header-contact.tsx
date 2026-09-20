import { Box } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ProtectedEmail } from '../../contact/protected-email';
import type { ResumeHeaderProps } from './types';
import { ResumeProfileLink } from './resume-profile-link';

type ResumeHeaderContactProps = Pick<
  ResumeHeaderProps,
  'site' | 'hasEmail' | 'hasProfiles' | 't' | 'tExternalProfiles'
>;

export function ResumeHeaderContact(props: ResumeHeaderContactProps) {
  if (!props.hasEmail && !props.hasProfiles) {
    return null;
  }

  return (
    <Box visualVariant="resumeHeader3">
      <ConditionalContent
        condition={props.hasEmail}
        content={
          <ProtectedEmail
            challenge={props.site.contact.emailChallenge}
            available={props.hasEmail}
            label={props.t('email')}
            showAddress
            typographyVariant="body2"
          />
        }
      />
      <ConditionalContent
        condition={props.hasProfiles}
        content={
          <Box visualVariant="resumeHeader4">
            {props.site.contact.profiles.map((contactProfile) => (
              <ResumeProfileLink
                key={contactProfile.url}
                profile={contactProfile}
                tExternalProfiles={props.tExternalProfiles}
              />
            ))}
          </Box>
        }
      />
    </Box>
  );
}
