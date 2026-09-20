import { createContext, type ReactNode } from 'react';
import type { InterfaceMessages } from '@portfolio/data/domain/types';

export type Locale = 'en' | 'pt-BR';

export type Message = string | { [key: string]: Message };

export type Translator = (key: string, values?: Record<string, string | number>) => string;

export type NavigationOptions = { locale?: Locale; resetScroll?: boolean };

export type I18nContextValue = { locale: Locale; messages: InterfaceMessages };

export const I18nContext = createContext<I18nContextValue>({ locale: 'en', messages: {} });

export type I18nProviderProps = {
  locale: Locale;
  messages: InterfaceMessages;
  children: ReactNode;
};
