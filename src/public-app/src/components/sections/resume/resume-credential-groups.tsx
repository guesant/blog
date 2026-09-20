import type { ResumeCredentialsProps } from './types';
import { ResumeCredentialSection } from './resume-credential-section';

type ResumeCredentialGroupsProps = ResumeCredentialsProps;

export function ResumeCredentialGroups(props: ResumeCredentialGroupsProps) {
  const credentialSections = [
    { key: 'certificates', title: props.t('certificates'), items: props.resume.certificates },
    { key: 'certifications', title: props.t('certifications'), items: props.resume.certifications },
    { key: 'publications', title: props.t('publications'), items: props.resume.publications },
  ] as const;

  return (
    <>
      {credentialSections
        .filter((section) => section.items.length > 0)
        .map((section) => (
          <ResumeCredentialSection key={section.key} section={section} />
        ))}
    </>
  );
}
