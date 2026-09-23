import { queryOptions } from '@tanstack/react-query';
import { ShellData, loadShell } from './content-data-support';

export const shellQueryOptions = (locale: string) =>
  queryOptions<ShellData | undefined>({
    queryKey: ['shell', locale],
    enabled: typeof window !== 'undefined',
    placeholderData: (previousData) => previousData,
    queryFn: async () => (await loadShell({ data: locale })) as ShellData | undefined,
  });
