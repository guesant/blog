'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { useSyncExternalStore } from 'react';
import { getConsentSnapshot, subscribeToConsent } from './analytics-consent-store';

type WindowWithDataLayer = Window & { dataLayer?: Record<string, unknown>[] };

type WebVitalsReporterProps = { enabled: boolean };

export function WebVitalsReporter(props: WebVitalsReporterProps) {
  const { enabled } = props;
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => 'loading');
  const canReport = enabled && consent === 'granted';

  useReportWebVitals((metric) => {
    if (!canReport) {
      return;
    }

    const target = window as WindowWithDataLayer;
    target.dataLayer = target.dataLayer ?? [];
    target.dataLayer.push({
      event: 'web_vitals',
      web_vitals_name: metric.name,
      web_vitals_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      web_vitals_rating: metric.rating,
      web_vitals_id: metric.id,
    });
  });

  return null;
}
