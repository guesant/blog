'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTranslations } from '@/i18n/compat';
import { useSyncExternalStore } from 'react';
import { LayoutStack as Stack } from '../primitives/layout-stack';

import {
  type Consent,
  consentChangeEvent,
  getConsentSnapshot,
  setMemoryConsent,
  storageKey,
  subscribeToConsent,
} from './analytics-consent-store';

type AnalyticsConsentProps = {
  googleTagManagerId?: string;
  googleAnalyticsId?: string;
};

function persistConsent(value: Extract<Consent, 'granted' | 'denied'>) {
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    return;
  }
}

function chooseConsent(value: Extract<Consent, 'granted' | 'denied'>) {
  setMemoryConsent(value);
  persistConsent(value);
  window.dispatchEvent(new Event(consentChangeEvent));
}

function analyticsIntegration(props: AnalyticsConsentProps) {
  void props;
  return null;
}

export function AnalyticsConsent(props: AnalyticsConsentProps) {
  const { googleTagManagerId, googleAnalyticsId } = props;
  const t = useTranslations('Analytics');
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => 'loading');
  const analyticsConfigured = Boolean(googleTagManagerId || googleAnalyticsId);

  if (!analyticsConfigured) {
    return null;
  }

  return (
    <>
      {consent === 'granted' && analyticsIntegration(props)}

      {consent === 'unset' && (
        <Box
          sx={{
            position: 'fixed',
            right: { xs: 2, sm: 3 },
            bottom: { xs: 2, sm: 3 },
            zIndex: (theme) => theme.zIndex.snackbar,
            width: { xs: 'calc(100% - 2rem)', sm: '22rem' },
          }}
        >
          <Paper
            role="dialog"
            aria-labelledby="analytics-consent-title"
            variant="outlined"
            sx={{
              borderColor: 'divider',
              p: 2.5,
              boxShadow: '0 0.75rem 2.5rem rgba(23,32,51,.12)',
            }}
          >
            <Stack sx={{ gap: 1.5 }}>
              <Box>
                <Typography
                  id="analytics-consent-title"
                  variant="subtitle2"
                  sx={{ fontWeight: 600 }}
                >
                  {t('title')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t('description')}
                </Typography>
              </Box>
              <Stack direction="row" sx={{ justifyContent: 'flex-end', gap: 1 }}>
                <Button size="small" color="inherit" onClick={() => chooseConsent('denied')}>
                  {t('decline')}
                </Button>
                <Button size="small" variant="contained" onClick={() => chooseConsent('granted')}>
                  {t('accept')}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      )}
    </>
  );
}
