import en from './messages/en.json';
import ptBR from './messages/pt-BR.json';
import type { InterfaceMessages, Locale, MessageKeyPaths } from './compat-support';

type EnglishMessageKeys = MessageKeyPaths<typeof en>;

type PortugueseMessageKeys = MessageKeyPaths<typeof ptBR>;

type CatalogParityError =
  | Exclude<EnglishMessageKeys, PortugueseMessageKeys>
  | Exclude<PortugueseMessageKeys, EnglishMessageKeys>;

const catalogParity: CatalogParityError extends never ? true : never = true;

void catalogParity;

const catalogs: Record<Locale, InterfaceMessages> = {
  en: en as InterfaceMessages,
  'pt-BR': ptBR as InterfaceMessages,
};

export function getMessages(locale: Locale): InterfaceMessages {
  return catalogs[locale];
}
