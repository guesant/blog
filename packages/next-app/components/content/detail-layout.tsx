import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

type DetailArticleProps = { children: ReactNode };

export function DetailArticle(props: DetailArticleProps) {
  return (
    <Box component="article" sx={{ py: { xs: 8, md: 10 }, maxWidth: '52rem', mx: 'auto' }}>
      {props.children}
    </Box>
  );
}

type Metric = { label: string; value: string };
type MetricsGridProps = {
  metrics: Metric[];
  marginTop: number;
  editableProps?: Record<string, string | undefined>;
};

export function MetricsGrid(props: MetricsGridProps) {
  const { metrics, marginTop, editableProps } = props;
  if (metrics.length === 0) {
    return null;
  }

  return (
    <Box
      {...editableProps}
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(9rem, 1fr))' },
        gap: 3,
        mt: marginTop,
        pt: 4,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      {metrics.map((metric) => (
        <Box key={`${metric.label}-${metric.value}`}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {metric.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {metric.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
