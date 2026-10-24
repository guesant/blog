import { useTranslations } from '@/i18n/compat';
import { EmptyState } from '../../content/empty-state';

export function TopicsEmptyState() {
  const t = useTranslations('Common');

  return <EmptyState>{t('emptyTopics')}</EmptyState>;
}
