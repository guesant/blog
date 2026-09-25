import type { Locale } from '../../i18n/compat-support';
import { lookup } from '../../i18n/compat-lookup';
import { getMessages } from '../../i18n/messages';
import type { RouteMetadata } from './splat-support';
import { defaultMetadata } from './splat-metadata-default';

type LocalizedMetadataProps = {
  locale: Locale;
  titlePath: string;
  descriptionPath: string;
};

export function localizedMetadata(props: LocalizedMetadataProps): RouteMetadata {
  const messages = getMessages(props.locale);

  const title = lookup(messages, props.titlePath);

  const description = lookup(messages, props.descriptionPath);

  const fallback = defaultMetadata();

  return {
    title: typeof title === 'string' ? title : fallback.title,
    description: typeof description === 'string' ? description : fallback.description,
  };
}
