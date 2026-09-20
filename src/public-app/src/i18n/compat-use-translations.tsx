import { useContext, useMemo } from 'react';
import { Translator, I18nContext } from './compat-support';
import { translator } from './compat-translator';

export function useTranslations(namespace?: string): Translator {
  const { messages } = useContext(I18nContext);

  return useMemo(() => translator(messages, namespace), [messages, namespace]);
}
