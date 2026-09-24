import { Box, Typography } from '../../../ui';

type HomeGallerySectionHeaderProps = {
  title: string;
};

export function HomeGallerySectionHeader(props: HomeGallerySectionHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        mb: 3,
        textAlign: 'center',
      }}
    >
      <Typography component="h2" variant="h2">
        {props.title}
      </Typography>
    </Box>
  );
}
