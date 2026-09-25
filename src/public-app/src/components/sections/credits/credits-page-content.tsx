import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import type { CreditsPageContentProps } from './types';
import { CreditsPageSections } from './credits-page-sections';

export function CreditsPageContent(props: CreditsPageContentProps) {
  const { content } = props;

  const t = useTranslations('Pages.credits');

  const tFooter = useTranslations('Footer');

  return (
    <>
      <PageHeader
        title={content.page.title}
        description={content.page.description}
        breadcrumbs={[{ label: tFooter('credits') }]}
        visualVariant="creditsPageHeader"
        descriptionVisualVariant="pageHeader3Wide"
      />
      <CreditsPageSections content={content} t={t} />
    </>
  );
}
