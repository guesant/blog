const STORAGE_KEY = 'analytics-consent';

function readStoredConsent() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

function persistConsent(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage unavailable (private mode, disabled) — consent still
    // applies for this page load via the in-memory dataLayer push below.
  }
}

function injectGtm(gtmId) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(script);
}

function injectGa(gaId) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaId);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(script);
}

function loadAnalytics(gtmId, gaId) {
  if (gtmId) {
    injectGtm(gtmId);
  } else if (gaId) {
    injectGa(gaId);
  }
}

export function reportWebVitals() {
  import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    const report = (metric) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'web_vitals',
        web_vitals_name: metric.name,
        web_vitals_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        web_vitals_rating: metric.rating,
        web_vitals_id: metric.id,
      });
    };
    onCLS(report);
    onINP(report);
    onLCP(report);
    onFCP(report);
    onTTFB(report);
  });
}

export function initAnalyticsConsent() {
  const banner = document.querySelector('[data-analytics-consent]');
  if (!banner) return;

  const gtmId = banner.dataset.gtmId || null;
  const gaId = banner.dataset.gaId || null;
  if (!gtmId && !gaId) return;

  const acceptButton = banner.querySelector('[data-analytics-accept]');
  const declineButton = banner.querySelector('[data-analytics-decline]');

  const activate = () => {
    loadAnalytics(gtmId, gaId);
    reportWebVitals();
  };

  const stored = readStoredConsent();
  if (stored === 'granted') {
    activate();
    return;
  }
  if (stored === 'denied') {
    return;
  }

  banner.hidden = false;

  acceptButton?.addEventListener('click', () => {
    persistConsent('granted');
    banner.hidden = true;
    activate();
  });

  declineButton?.addEventListener('click', () => {
    persistConsent('denied');
    banner.hidden = true;
  });
}
