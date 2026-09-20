import type { useRouter } from '../../../i18n/compat';
import type { SortMode } from './types';

export type ContentFeedRouter = ReturnType<typeof useRouter>;

export type ContentFeedActionProps = {
  action: string;
  fixedKind?: string;
  kind: string;
  topic: string;
  type: string;
  pendingSearch: string;
  sort: SortMode;
  query: URLSearchParams;
  router: ContentFeedRouter;
  setKind: (value: string) => void;
  setTopic: (value: string) => void;
  setType: (value: string) => void;
  setSearch: (value: string) => void;
  setPendingSearch: (value: string) => void;
  setSort: (value: SortMode) => void;
};
