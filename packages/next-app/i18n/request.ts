import { getInterfaceMessages } from '@portfolio/content/server';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async (props) => {
  const { requestLocale } = props;
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await getInterfaceMessages(locale),
  };
});
