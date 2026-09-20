import { queryOptions } from '@tanstack/react-query';
import { ShellData, loadShell } from './content-data-support';

export const shellQueryOptions = (locale: string) =>
  queryOptions<ShellData>({
    queryKey: ['shell', locale],
    queryFn: async () => (await loadShell({ data: locale })) as ShellData,
  });
