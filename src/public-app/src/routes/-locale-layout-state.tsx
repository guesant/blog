import { Outlet } from '@tanstack/react-router';
import type { ShellData } from '@portfolio/data/queries';
import { LocaleLayoutContent } from '../components/layouts/locale-layout-content';
import { LoadingPage } from '../components/sections/loading';
import { StatusPage } from '../components/sections/status';

export type LocaleLayoutStateProps = {
  shell?: ShellData;
  isError: boolean;
  retry: () => void;
};

export function LocaleLayoutState(props: LocaleLayoutStateProps) {
  if (props.shell !== undefined) {
    return <LocaleLayoutContent shell={props.shell} children={<Outlet />} />;
  }

  if (props.isError) {
    return <StatusPage kind="error" reset={props.retry} />;
  }

  return <LoadingPage />;
}
