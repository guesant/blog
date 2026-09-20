import { useContext } from 'react';
import { Locale, I18nContext } from './compat-support';

export function useLocale(): Locale {
  return useContext(I18nContext).locale;
}
