import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type PortfolioPaginationMetaProps = {
  cases: ContentCollectionMeta;
  projects: ContentCollectionMeta;
  experiments: ContentCollectionMeta;
};

export function portfolioPaginationMeta(
  props: PortfolioPaginationMetaProps,
): ContentCollectionMeta {
  return {
    page: props.cases.page,
    perPage: props.cases.perPage,
    total: Math.max(props.cases.total, props.projects.total, props.experiments.total),
    lastPage: Math.max(props.cases.lastPage, props.projects.lastPage, props.experiments.lastPage),
    locale: props.cases.locale,
  };
}
