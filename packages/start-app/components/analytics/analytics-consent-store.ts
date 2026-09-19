export const storageKey = 'portfolio:analytics-consent:v1';
export const consentChangeEvent = 'portfolio:analytics-consent-change';

export type Consent = 'loading' | 'unset' | 'granted' | 'denied';
type ConsentStoreListener = () => void;

let memoryConsent: Exclude<Consent, 'loading'> = 'unset';

export function setMemoryConsent(value: Exclude<Consent, 'loading'>) {
  memoryConsent = value;
}

export function getConsentSnapshot(): Consent {
  try {
    const storedConsent = window.localStorage.getItem(storageKey);
    return storedConsent === 'granted' || storedConsent === 'denied'
      ? storedConsent
      : memoryConsent;
  } catch {
    return memoryConsent;
  }
}

export function subscribeToConsent(onStoreChange: ConsentStoreListener) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(consentChangeEvent, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(consentChangeEvent, onStoreChange);
  };
}
