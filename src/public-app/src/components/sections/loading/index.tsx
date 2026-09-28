import { CircularProgress } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { StatusPageFrame } from '../../ui/semantic/StatusPageFrame';

export function LoadingPage() {
  const t = useTranslations('Common');

  return (
    <StatusPageFrame aria-busy="true">
      <CircularProgress aria-label={t('loading')} color="primary" />
    </StatusPageFrame>
  );
}
