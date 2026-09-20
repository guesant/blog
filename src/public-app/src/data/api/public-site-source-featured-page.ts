import type { RecordValue } from './public-site-source-support';
import { recordList } from './public-site-source-list';

type FeaturedPageProps = {
  page: RecordValue;
  key: string;
  value: unknown;
};

export function featuredPage(props: FeaturedPageProps): RecordValue {
  return {
    ...props.page,
    [props.key]: recordList<RecordValue>(props.value).map((item) => ({ item: item.slug })),
  };
}
