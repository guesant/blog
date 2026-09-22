import en from './messages/en.json';
import ptBR from './messages/pt-BR.json';
import type { InterfaceMessages, Locale } from './compat-support';

const catalogs: Record<Locale, InterfaceMessages> = {
  en: en as InterfaceMessages,
  'pt-BR': ptBR as InterfaceMessages,
};

export function getMessages(locale: Locale): InterfaceMessages {
  return catalogs[locale];
}
