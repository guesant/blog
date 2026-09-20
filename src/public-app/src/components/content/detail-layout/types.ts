import type { ReactNode } from 'react';

export type DetailArticleProps = { children: ReactNode };

type Metric = { label: string; value: string };

export type MetricsGridProps = {
  metrics: Metric[];
  marginTop: number;
};
