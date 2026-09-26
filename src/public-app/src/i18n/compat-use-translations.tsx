import { useContext, useMemo } from 'react';
import {
  I18nContext,
  type NamespaceTranslator,
  type TranslationNamespace,
  type Translator,
} from './compat-support';
import { translator } from './compat-translator';

export function useTranslations<Namespace extends TranslationNamespace>(
  namespace: Namespace,
): NamespaceTranslator<Namespace>;

export function useTranslations(namespace: `Pages.${string}`): Translator;

export function useTranslations(namespace: string): Translator {
  const { messages } = useContext(I18nContext);

  return useMemo(() => translator(messages, namespace), [messages, namespace]) as Translator;
}
