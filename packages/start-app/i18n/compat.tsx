import { useLocation, useRouter as useTanStackRouter } from '@tanstack/react-router';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { InterfaceMessages } from '@portfolio/content/types';

type Locale = 'en' | 'pt-BR';
type Message = string | { [key: string]: Message };
type Translator = (key: string, values?: Record<string, string | number>) => string;

type I18nContextValue = { locale: Locale; messages: InterfaceMessages };

const I18nContext = createContext<I18nContextValue>({ locale: 'en', messages: {} });

export function I18nProvider(props: { locale: Locale; messages: InterfaceMessages; children: ReactNode }) {
  return <I18nContext.Provider value={props}>{props.children}</I18nContext.Provider>;
}

function lookup(value: Message | undefined, path: string): Message | undefined {
  return path.split('.').reduce<Message | undefined>((current, segment) => {
    if (!current || typeof current === 'string') return undefined;
    return current[segment];
  }, value);
}

function translator(messages: InterfaceMessages, namespace?: string): Translator {
  return (key, values) => {
    const result = lookup(namespace ? messages[namespace] : messages, key);
    if (typeof result !== 'string') return key;
    return values
      ? Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), result)
      : result;
  };
}

export function useLocale(): Locale {
  return useContext(I18nContext).locale;
}

export function useTranslations(namespace?: string): Translator {
  const { messages } = useContext(I18nContext);
  return useMemo(() => translator(messages, namespace), [messages, namespace]);
}

export function useRouter() {
  const router = useTanStackRouter();
  return {
    replace: (href: string) => router.navigate({ to: href as never, replace: true }),
    push: (href: string) => router.navigate({ to: href as never }),
    back: () => window.history.back(),
    refresh: () => router.invalidate(),
  };
}

export function usePathname() {
  return useLocation({ select: (location) => location.pathname });
}

export function hasLocale(locales: readonly string[], value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value));
}

export function getLocale() {
  return 'en' as const;
}

export function getTranslations(namespace?: string) {
  return Promise.resolve(translator({}, namespace));
}
