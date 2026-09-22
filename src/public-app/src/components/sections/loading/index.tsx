import { Box, CircularProgress } from '../../ui';
import { useTranslations } from '@/i18n/compat';

export function LoadingPage() {
  const t = useTranslations('Common');

  return (
    <Box visualVariant="statusPage" aria-busy="true">
      <CircularProgress aria-label={t('loading')} color="primary" />
    </Box>
  );
}
