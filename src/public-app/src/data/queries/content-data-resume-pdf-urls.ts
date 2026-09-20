import { publicApiBaseUrl } from './content-data-public-api-base-url';

export function resumePdfUrls(): Record<'en' | 'pt-BR', string> {
  const baseUrl = publicApiBaseUrl();

  return {
    en: `${baseUrl}/resume/en.pdf`,
    'pt-BR': `${baseUrl}/resume/pt-BR.pdf`,
  };
}
