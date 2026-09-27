import { Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { ProtectedEmail } from '../../contact/protected-email';
import { PageHeader } from '../../content/page-header';
import type { LicensePageContentProps } from './types';
import { LicenseSection } from './license-section';
import { LicenseContact } from './ui/contact';
import { ConditionalContent } from '../../primitives/conditional-content';

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
      />
      {sections.map((section) => (
        <LicenseSection
          key={section.heading}
          heading={section.heading ?? ''}
          body={section.body ?? ''}
        />
      ))}
      <ConditionalContent
        condition={Boolean(emailChallenge)}
        content={
          <LicenseContact>
            <Typography color="text.secondary">{page.contact}</Typography>
            <ProtectedEmail challenge={emailChallenge} label={tCommon('reveal')} showAddress />
          </LicenseContact>
        }
      />
    </>
  );
}
