import type { MouseEvent } from 'react';
import type { useRouter } from '../../../i18n/compat';

type SidebarRouter = ReturnType<typeof useRouter>;

type SidebarLocaleChangeProps = {
  router: SidebarRouter;
  pathname: string;
};

export function handleSidebarLocaleChange(
  props: SidebarLocaleChangeProps,
  _event: MouseEvent<HTMLElement>,
  value: string | null,
) {
  if (value) {
    props.router.push(props.pathname, {
      locale: value as 'en' | 'pt-BR',
      resetScroll: false,
    });
  }
}
