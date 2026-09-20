import { getLocalizedPage } from '../api/public-site-source.ts';
import { stringValue } from '../api/public-site-source-string-value';

export async function getLicensePageCopy(locale?: string) {
  const page = await getLocalizedPage<Record<string, unknown>>('license', locale);

  return {
    ...page,
    eyebrow: stringValue(page.eyebrow),
    title: stringValue(page.title),
    description: stringValue(page.description),
    sectionLabel: stringValue(page.section_label),
    sectionTitle: stringValue(page.section_title),
    codeHeading: stringValue(page.code_heading),
    codeBody: stringValue(page.code_body),
    contentHeading: stringValue(page.content_heading),
    contentBody: stringValue(page.content_body),
    aiHeading: stringValue(page.ai_heading),
    aiBody: stringValue(page.ai_body),
    contact: stringValue(page.contact),
  } as import('../domain/types.ts').LicensePageCopy;
}
