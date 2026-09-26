import { createContext, type ReactNode } from 'react';
import type en from './messages/en.json';

export type Locale = 'en' | 'pt-BR';

export type Message = string | { [key: string]: Message };

export type InterfaceMessages = { [key: string]: Message };

export type Translator = (key: string, values?: Record<string, string | number>) => string;

export type MessageKeyPaths<T> = T extends object
  ? {
      [Key in keyof T & string]: T[Key] extends string
        ? Key
        : T[Key] extends object
          ? `${Key}.${MessageKeyPaths<T[Key]>}`
          : never;
    }[keyof T & string]
  : never;

type NamespacePaths<T> = T extends object
  ? {
      [Key in keyof T & string]: T[Key] extends object
        ? Key | `${Key}.${NamespacePaths<T[Key]>}`
        : never;
    }[keyof T & string]
  : never;

type MessageAtPath<T, Path extends string> = Path extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? MessageAtPath<T[Head], Tail>
    : never
  : Path extends keyof T
    ? T[Path]
    : never;

export type TranslationNamespace = NamespacePaths<typeof en>;

export type TranslationKey<Namespace extends TranslationNamespace> = MessageKeyPaths<
  Extract<MessageAtPath<typeof en, Namespace>, object>
>;

export type HomeTranslationKey = TranslationKey<'Home'>;

export type AchadosTranslationKey =
  | TranslationKey<'Pages.achados'>
  | `types.${string}`
  | `ratings.${string}`
  | `consumptionStates.${string}`
  | `sourcePreview.kinds.${string}`
  | `sourcePreview.fields.${string}`;

// jscpd:ignore-start
export type HomeTranslator = NamespaceTranslator<'Home'>;

export type AchadosTranslator = NamespaceTranslator<'Pages.achados', AchadosTranslationKey>;

export type NavTranslationKey = TranslationKey<'Nav'>;

export type SidebarTranslationKey = TranslationKey<'Sidebar'>;

export type NavTranslator = NamespaceTranslator<'Nav'>;

export type SidebarTranslator = NamespaceTranslator<'Sidebar'>;

export type CommonTranslator = NamespaceTranslator<'Common'>;

export type ExternalProfilesTranslator = NamespaceTranslator<'ExternalProfiles'>;

export type IllustrationTranslator = NamespaceTranslator<'Illustration'>;

export type ContentActionsTranslator = NamespaceTranslator<'Pages.contentActions'>;

type StatusTranslationKey = 'title' | 'description' | 'retry' | 'home' | 'issue';

export type StatusTranslator = NamespaceTranslator<'Pages.error', StatusTranslationKey>;

export type CasesTranslator = NamespaceTranslator<'Pages.cases'>;

export type ProjectsTranslator = NamespaceTranslator<'Pages.projects'>;

export type ContactTranslator = NamespaceTranslator<'Pages.contact'>;

export type CreditsTranslator = NamespaceTranslator<'Pages.credits'>;

export type ResumeTranslator = NamespaceTranslator<'Pages.resume'>;

export type FieldsTranslator = NamespaceTranslator<'Pages.achados.fields'>;

export type SourcePreviewTranslationKey = Extract<AchadosTranslationKey, `sourcePreview.${string}`>;
// jscpd:ignore-end

type NamespaceTranslationKey<Namespace extends TranslationNamespace> =
  Namespace extends 'Pages.achados' ? AchadosTranslationKey : TranslationKey<Namespace>;

export type NamespaceTranslator<
  Namespace extends TranslationNamespace,
  Key extends string = NamespaceTranslationKey<Namespace>,
> = (key: Key, values?: Record<string, string | number>) => string;

export type NavigationOptions = { locale?: Locale; resetScroll?: boolean };

export type I18nContextValue = { locale: Locale; messages: InterfaceMessages };

export const I18nContext = createContext<I18nContextValue>({ locale: 'en', messages: {} });

export type I18nProviderProps = {
  locale: Locale;
  messages: InterfaceMessages;
  children: ReactNode;
};
