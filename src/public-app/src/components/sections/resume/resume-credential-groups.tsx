import type { ResumeCredentialsProps } from './types';
import { CredentialEntries } from './credential-entries';
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
      {credentialSections.map((section) => (
        <ResumeCredentialSection
          key={section.key}
          condition={section.items.length > 0}
          title={section.title}
          entries={<CredentialEntries items={section.items} />}
        />
      ))}
    </>
  );
}
