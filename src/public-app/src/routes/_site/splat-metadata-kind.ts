import type { RouteData } from '../../data/queries';
import type { Locale } from '../../i18n/compat-support';
import type { RouteMetadata } from './splat-support';
import { localizedMetadata } from './splat-metadata-localized';

export function kindMetadata(data: RouteData, locale: Locale): RouteMetadata {
  if (data.kind === 'snippets') {
    return localizedMetadata({
      locale,
      titlePath: 'Nav.snippets',
      descriptionPath: 'Nav.snippetsDescription',
    });
  }

  if (data.kind === 'technologies') {
    return localizedMetadata({
      locale,
      titlePath: 'Nav.technologies',
      descriptionPath: 'Nav.technologiesDescription',
    });
  }

  return localizedMetadata({
    locale,
    titlePath: 'Nav.findings',
    descriptionPath: 'Pages.feed.description',
  });
}
