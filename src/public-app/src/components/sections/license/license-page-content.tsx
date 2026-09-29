import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import type { LicensePageContentProps } from './types';
import { LicenseSection } from './license-section';
import { LicenseContactContent } from './ui/contact-content';

export function LicensePageContent(props: LicensePageContentProps) {
  const { page, emailChallenge } = props;

  const tFooter = useTranslations('Footer');

  const tCommon = useTranslations('Common');

  const sections = [
    { heading: page.codeHeading, body: page.codeBody },
    { heading: page.contentHeading, body: page.contentBody },
    { heading: page.aiHeading, body: page.aiBody },
  ].filter(({ heading, body }) => Boolean(heading || body));

  return (
    <>
      <PageHeader
        title={page.title}
        description={page.description}
        breadcrumbs={[{ label: tFooter('license') }]}
        variant="reading"
      />
      {sections.map((section) => (
        <LicenseSection
          key={section.heading}
          heading={section.heading ?? ''}
          body={section.body ?? ''}
        />
      ))}
      <LicenseContactContent
        contact={page.contact}
        emailChallenge={emailChallenge}
        revealLabel={tCommon('reveal')}
      />
    </>
  );
}
