import { Box, Typography } from '../../../ui';
import { ConditionalContent } from '../../../primitives/conditional-content';

type HomeGallerySectionHeaderProps = {
  title: string;
  summary?: string;
};

export function HomeGallerySectionHeader(props: HomeGallerySectionHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        mb: 'var(--site-space-6)',
        textAlign: 'center',
      }}
    >
      <Typography component="h2" variant="h2">
        {props.title}
      </Typography>
      <ConditionalContent
        condition={Boolean(props.summary)}
        content={
          <Typography variant="body2" color="text.secondary">
            {props.summary}
          </Typography>
        }
      />
    </Box>
  );
}
