'use client';

import { useSyncExternalStore } from 'react';
import { getConsentSnapshot, subscribeToConsent } from './analytics-consent-store';

type WindowWithDataLayer = Window & { dataLayer?: Record<string, unknown>[] };

type WebVitalsReporterProps = { enabled: boolean };

export function WebVitalsReporter(props: WebVitalsReporterProps) {
  const { enabled } = props;
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => 'loading');
  const canReport = enabled && consent === 'granted';

  void canReport;

  return null;
}
