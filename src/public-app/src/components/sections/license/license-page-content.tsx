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

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        breadcrumbs={[{ label: tFooter('license') }]}
      />
      <LicenseSection heading={page.codeHeading}>{page.codeBody}</LicenseSection>
      <LicenseSection heading={page.contentHeading}>{page.contentBody}</LicenseSection>
      <LicenseSection heading={page.aiHeading}>{page.aiBody}</LicenseSection>
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
