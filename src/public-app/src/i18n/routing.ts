export const routing = {
  locales: ['en', 'pt-BR'] as const,
  defaultLocale: 'en' as const,
  localePrefix: 'as-needed' as const,
};

export type Locale = (typeof routing.locales)[number];

export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0];

  return routing.locales.includes(segment as Locale) ? (segment as Locale) : routing.defaultLocale;
}
